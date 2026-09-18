export type PostSection = {
  heading: string;
  text: string;
};

export type PostExtractResult = {
  sections: PostSection[];
  headings: string[];
};

const MAX_CHUNK = 1200;
const SKIP_TAGS = new Set([
  "PRE",
  "FIGURE",
  "FIGCAPTION",
  "SCRIPT",
  "STYLE",
  "SVG",
  "BUTTON",
  "DIALOG",
  "CANVAS",
  "NOSCRIPT",
]);

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function stripListPrefix(text: string): string {
  return text.replace(/^[\s]*[—–\-•]\s*/, "").trim();
}

function collectText(el: Element): string {
  if (SKIP_TAGS.has(el.tagName)) return "";

  if (el.tagName === "LI") {
    const clone = el.cloneNode(true) as Element;
    for (const decorative of clone.querySelectorAll(":scope > span.shrink-0, :scope > span.opacity-30")) {
      decorative.remove();
    }
    return stripListPrefix(normalizeWhitespace(clone.textContent ?? ""));
  }

  if (el.tagName === "BLOCKQUOTE") {
    const parts: string[] = [];
    for (const child of Array.from(el.children)) {
      const t = collectText(child);
      if (t) parts.push(t);
    }
    if (parts.length) return parts.join(" ");
    return normalizeWhitespace(el.textContent ?? "");
  }

  if (el.tagName === "UL" || el.tagName === "OL") {
    const parts: string[] = [];
    for (const child of Array.from(el.children)) {
      const t = collectText(child);
      if (t) parts.push(t);
    }
    return parts.join(" ");
  }

  if (el.tagName === "P") {
    return normalizeWhitespace(el.textContent ?? "");
  }

  return normalizeWhitespace(el.textContent ?? "");
}

function splitLongSection(heading: string, text: string): PostSection[] {
  if (text.length <= MAX_CHUNK) {
    return text ? [{ heading, text }] : [];
  }

  const chunks: PostSection[] = [];
  let remaining = text;

  while (remaining.length > MAX_CHUNK) {
    const window = remaining.slice(0, MAX_CHUNK);
    const sentenceEnd = Math.max(
      window.lastIndexOf(". "),
      window.lastIndexOf("? "),
      window.lastIndexOf("! "),
      window.lastIndexOf("\n"),
    );
    const cut = sentenceEnd > MAX_CHUNK * 0.4 ? sentenceEnd + 1 : MAX_CHUNK;
    const piece = remaining.slice(0, cut).trim();
    if (piece) chunks.push({ heading, text: piece });
    remaining = remaining.slice(cut).trim();
  }

  if (remaining) chunks.push({ heading, text: remaining });
  return chunks;
}

function walkNodes(root: Element): { sections: PostSection[]; headings: string[] } {
  const headings: string[] = [];
  const raw: PostSection[] = [];
  let currentHeading = "";
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join(" ").trim();
    buffer = [];
    if (!text && !currentHeading) return;
    for (const chunk of splitLongSection(currentHeading, text)) {
      raw.push(chunk);
    }
  };

  const visit = (node: Element) => {
    const tag = node.tagName;

    if (SKIP_TAGS.has(tag)) return;

    if (tag === "H1" || tag === "H2" || tag === "H3") {
      flush();
      currentHeading = normalizeWhitespace(node.textContent ?? "");
      if (currentHeading) headings.push(currentHeading);
      return;
    }

    if (tag === "P" || tag === "LI" || tag === "BLOCKQUOTE") {
      const t = collectText(node);
      if (t) buffer.push(t);
      return;
    }

    if (tag === "UL" || tag === "OL") {
      for (const child of Array.from(node.children)) {
        if (child.tagName === "LI") {
          const t = collectText(child);
          if (t) buffer.push(t);
        }
      }
      return;
    }

    if (tag === "DIV" || tag === "SECTION" || tag === "ARTICLE") {
      if (node.querySelector(":scope > svg, :scope > canvas")) return;
      for (const child of Array.from(node.children)) {
        visit(child);
      }
      return;
    }
  };

  for (const child of Array.from(root.children)) {
    visit(child);
  }
  flush();

  return { sections: raw, headings };
}

export function extractPostSections(
  root: Element | null = typeof document !== "undefined"
    ? document.querySelector("[data-post-body]")
    : null,
): PostExtractResult {
  if (!root) {
    return { sections: [], headings: [] };
  }
  return walkNodes(root);
}
