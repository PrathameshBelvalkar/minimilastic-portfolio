import { extractPostOutline } from "./postExtract";

export const LOADING_STATUS = "Thinking…";
export const REFUSAL =
  "I can only answer from this blog post, and I couldn't find that in it.";

const MODEL_ID = "gemini-3.6-flash";
const MAX_MESSAGE_LENGTH = 500;
const MAX_SESSION_MESSAGES = 10;
const MAX_PER_MINUTE = 5;
const RATE_WINDOW_MS = 60_000;
const RATE_STORAGE_KEY = "blog-ai-rate-ts";

const GREETING_RE =
  /^(hi|hello|hey|yo|sup|hola|namaste|good\s*(morning|afternoon|evening)|howdy|thanks|thank\s*you|bye|goodbye|ok|okay|cool|nice|great)[\s!.?]*$/i;

const SUMMARY_RE =
  /\b(summarize|summary|tl;?dr|tldr|overview|what(?:'s| is) this (?:blog|post|article)(?: about)?|what(?:'s| is) (?:it|this) about)\b/i;

const INJECTION_RE =
  /\b(ignore (previous|all)|you are now|system:|pretend (you are|to be)|act as|jailbreak|dan mode)\b/i;

let sessionCount = 0;
let lastMessage = "";

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GENAI_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    throw new Error(
      "Missing VITE_GENAI_API_KEY. Add it to .env and restart the dev server.",
    );
  }
  return apiKey.trim();
}

function parseFallback(fallback: string): { title: string; excerpt: string } {
  const titleMatch = fallback.match(/^Title:\s*(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? "";
  const excerpt = fallback.replace(/^Title:\s*.+$/m, "").trim();
  return { title, excerpt };
}

function buildSummary(fallback: string): string {
  const outline = extractPostOutline();
  const { title, excerpt } = parseFallback(fallback);
  const lead = outline.lead || excerpt || "No description available.";
  const headings =
    outline.headings.length > 0
      ? outline.headings
          .slice(0, 8)
          .map((h) => `- ${h}`)
          .join("\n")
      : "";

  const parts = [
    title ? `This post is about **${title}**.` : "Here's what this post covers.",
    lead,
  ];
  if (headings) {
    parts.push(`**Sections:**\n${headings}`);
  }
  parts.push(
    "Ask me a specific question from the post if you want more detail.",
  );
  return parts.join("\n\n");
}

function greetingReply(): string {
  return "Hi! I can help with this blog post — ask what it’s about, or ask a specific question from it.";
}

function resolvePostContent(fallback: string): string {
  const outline = extractPostOutline();
  if (outline.text.trim()) return outline.text.slice(0, 8000);
  return fallback.slice(0, 8000);
}

function readMinuteTimestamps(): number[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(RATE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed
      .filter((t): t is number => typeof t === "number")
      .filter((t) => now - t < RATE_WINDOW_MS);
  } catch {
    return [];
  }
}

function writeMinuteTimestamps(timestamps: number[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(timestamps));
  } catch {
    /* ignore */
  }
}

function checkRateLimit(): string | null {
  if (sessionCount >= MAX_SESSION_MESSAGES) {
    return "You've reached the message limit for this session. Refresh the page later to continue.";
  }

  const recent = readMinuteTimestamps();
  if (recent.length >= MAX_PER_MINUTE) {
    return "You're sending messages too quickly. Please wait a minute and try again.";
  }

  return null;
}

function recordRateUse() {
  sessionCount += 1;
  const recent = readMinuteTimestamps();
  recent.push(Date.now());
  writeMinuteTimestamps(recent);
}

function checkAbuse(question: string): string | null {
  if (question.length > MAX_MESSAGE_LENGTH) {
    return `Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  if (INJECTION_RE.test(question)) {
    return "That request isn't allowed. Ask a normal question about this blog post.";
  }

  const normalized = question.toLowerCase().trim();
  if (lastMessage && normalized === lastMessage) {
    return "Looks like a repeat of your last message. Try asking something different.";
  }

  return null;
}

function buildSystemInstruction(postContent: string): string {
  return `You are a helpful assistant embedded in a blog post.
Answer conversationally and concisely.
Prefer the post content below for blog questions.
For greetings or small talk, reply warmly in one short sentence.
If the answer is not in the post, say so briefly.
Do not invent facts that are not in the post.

--- Blog Post ---
${postContent || "(no post content available)"}`;
}

function extractTextFromChunk(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const candidates = (data as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || !candidates[0]) return "";
  const content = (candidates[0] as { content?: { parts?: unknown } }).content;
  const parts = content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => {
      if (part && typeof part === "object" && "text" in part) {
        return String((part as { text?: unknown }).text ?? "");
      }
      return "";
    })
    .join("");
}

async function* streamGemini(
  question: string,
  postContent: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const apiKey = getApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: buildSystemInstruction(postContent) }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errJson = (await res.json()) as {
        error?: { message?: string };
      };
      detail = errJson.error?.message ?? "";
    } catch {
      detail = await res.text().catch(() => "");
    }
    if (res.status === 400 || res.status === 403) {
      throw new Error(
        detail ||
          "Gemini rejected the API key. Check VITE_GENAI_API_KEY in .env (use an AI Studio key starting with AIza).",
      );
    }
    if (res.status === 429) {
      throw new Error("Gemini rate limit hit. Please wait a moment and try again.");
    }
    throw new Error(detail || `Gemini request failed (${res.status}).`);
  }

  if (!res.body) {
    throw new Error("Gemini returned an empty response body.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const parsed: unknown = JSON.parse(payload);
        const piece = extractTextFromChunk(parsed);
        if (!piece) continue;
        accumulated += piece;
        yield accumulated;
      } catch {
        /* ignore partial JSON */
      }
    }
  }

  if (!accumulated.trim()) {
    yield REFUSAL;
  }
}

export async function* streamAnswerFromPost(
  question: string,
  postFallback: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const trimmed = question.trim();
  if (!trimmed) {
    yield greetingReply();
    return;
  }

  if (GREETING_RE.test(trimmed)) {
    yield greetingReply();
    return;
  }

  if (SUMMARY_RE.test(trimmed)) {
    yield buildSummary(postFallback);
    return;
  }

  const rateError = checkRateLimit();
  if (rateError) {
    yield rateError;
    return;
  }

  const abuseError = checkAbuse(trimmed);
  if (abuseError) {
    yield abuseError;
    return;
  }

  recordRateUse();
  lastMessage = trimmed.toLowerCase();

  const postContent = resolvePostContent(postFallback);
  yield* streamGemini(trimmed, postContent, signal);
}

export async function answerFromPost(
  question: string,
  postFallback: string,
): Promise<string> {
  let last = "";
  for await (const chunk of streamAnswerFromPost(question, postFallback)) {
    last = chunk;
  }
  return last || REFUSAL;
}

export function formatAssistantError(err: unknown): string {
  if (err instanceof Error && err.message.trim()) return err.message;
  return "Something went wrong with the AI assistant. Please try again.";
}
