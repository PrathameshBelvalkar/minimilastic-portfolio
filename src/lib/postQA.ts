import { extractPostSections, type PostSection } from "./postExtract";

export const CONFIDENCE_THRESHOLD = 0.15;
export const SEARCHING_STATUS = "Searching this post…";
export const REFUSAL =
  "I can only answer questions about this blog post, and I couldn't find that in it.";

const SELF_HOST_MODEL = false;
const MODEL_ID = "Xenova/distilbert-base-cased-distilled-squad";
const TOP_K = 3;
const SOURCE_TRIM = 500;

const STOPWORDS = new Set([
  "the",
  "is",
  "are",
  "was",
  "were",
  "a",
  "an",
  "in",
  "on",
  "at",
  "to",
  "of",
  "and",
  "or",
  "for",
  "how",
  "why",
  "what",
  "when",
  "where",
  "which",
  "this",
  "that",
  "it",
  "do",
  "does",
  "did",
  "can",
  "could",
  "would",
  "should",
  "with",
  "from",
  "about",
  "into",
  "over",
  "under",
  "you",
  "your",
  "me",
  "my",
  "we",
  "our",
  "they",
  "their",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "not",
  "but",
  "if",
  "as",
  "by",
  "so",
  "than",
  "too",
  "very",
  "just",
  "also",
  "please",
  "tell",
  "explain",
]);

const SUMMARY_RE =
  /\b(summarize|summary|tl;?dr|tldr|overview|what(?:'s| is) this post(?: about)?)\b/i;

type QAResult = {
  answer: string;
  score: number;
};

type QAPipeline = (
  question: string,
  context: string,
) => Promise<QAResult>;

let pipelinePromise: Promise<QAPipeline> | null = null;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function keywordOverlap(questionTokens: string[], sectionText: string): number {
  const sectionTokens = new Set(tokenize(sectionText));
  let score = 0;
  for (const t of questionTokens) {
    if (sectionTokens.has(t)) score += 1;
  }
  return score;
}

function rankSections(question: string, sections: PostSection[]): PostSection[] {
  const qTokens = tokenize(question);
  if (!qTokens.length) return [];

  return sections
    .map((section) => ({
      section,
      score: keywordOverlap(qTokens, `${section.heading} ${section.text}`),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)
    .map((r) => r.section);
}

function isSummaryIntent(question: string): boolean {
  return SUMMARY_RE.test(question.trim());
}

function formatSummary(excerpt: string, headings: string[], firstSection?: PostSection): string {
  const description = excerpt.trim() || firstSection?.text || "No description available.";
  const headingList =
    headings.length > 0
      ? headings.map((h) => `- ${h}`).join("\n")
      : "- (no section headings)";
  return `${description}\n\n**Sections in this post:**\n${headingList}`;
}

function trimSource(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= SOURCE_TRIM) return clean;
  return `${clean.slice(0, SOURCE_TRIM).trim()}…`;
}

function formatAnswer(answer: string, source: string): string {
  return `**${answer.trim()}**\n\n> ${trimSource(source)}`;
}

async function loadQA(): Promise<QAPipeline> {
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      try {
        const transformers = await import("@huggingface/transformers");
        const { pipeline, env } = transformers;

        if (SELF_HOST_MODEL) {
          env.allowRemoteModels = false;
          env.allowLocalModels = true;
          env.localModelPath = "/models/";
          if (env.backends?.onnx?.wasm) {
            env.backends.onnx.wasm.wasmPaths = "/ort-wasm/";
          }
        }

        const qa = await pipeline("question-answering", MODEL_ID);
        return async (question: string, context: string) => {
          const result = await qa(question, context);
          const data = Array.isArray(result) ? result[0] : result;
          return {
            answer: String((data as QAResult)?.answer ?? ""),
            score: Number((data as QAResult)?.score ?? 0),
          };
        };
      } catch (err) {
        pipelinePromise = null;
        throw err;
      }
    })();
  }
  return pipelinePromise;
}

export async function answerFromPost(
  question: string,
  excerpt: string,
): Promise<string> {
  const { sections, headings } = extractPostSections();

  if (isSummaryIntent(question)) {
    return formatSummary(excerpt, headings, sections[0]);
  }

  if (!sections.length) {
    return REFUSAL;
  }

  const top = rankSections(question, sections);
  if (!top.length) {
    return REFUSAL;
  }

  const qa = await loadQA();
  let best: { answer: string; score: number; source: string } | null = null;

  for (const section of top) {
    const context = section.heading
      ? `${section.heading}. ${section.text}`
      : section.text;
    const result = await qa(question, context);
    if (!best || result.score > best.score) {
      best = { ...result, source: context };
    }
  }

  if (!best || best.score < CONFIDENCE_THRESHOLD || !best.answer.trim()) {
    return REFUSAL;
  }

  return formatAnswer(best.answer, best.source);
}
