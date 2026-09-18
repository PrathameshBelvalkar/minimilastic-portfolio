export type PostSection = {
  heading: string;
  text: string;
};

export type PostOutline = {
  text: string;
  lead: string;
  headings: string[];
  sections: PostSection[];
};

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

const MAX_SECTION = 900;

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
    for (const decorative of clone.querySelectorAll(
      ":scope > span.shrink-0, :scope > span.opacity-30",
    )) {
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

  return normalizeWhitespace(el.textContent ?? "");
}

function walkNodes(root: Element): {
  sections: PostSection[];
  headings: string[];
} {
  const headings: string[] = [];
  const sections: PostSection[] = [];
  let currentHeading = "";
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join(" ").trim();
    buffer = [];
    if (!text && !currentHeading) return;
    const clipped =
      text.length > MAX_SECTION ? `${text.slice(0, MAX_SECTION).trim()}…` : text;
    sections.push({ heading: currentHeading, text: clipped });
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
    }
  };

  for (const child of Array.from(root.children)) {
    visit(child);
  }
  flush();

  return { sections, headings };
}

export function extractPostOutline(
  root: Element | null = typeof document !== "undefined"
    ? document.querySelector("[data-post-body]")
    : null,
): PostOutline {
  if (!root) {
    return { text: "", lead: "", headings: [], sections: [] };
  }

  const { sections, headings } = walkNodes(root);
  const text = sections
    .map((s) => (s.heading ? `${s.heading}\n${s.text}` : s.text))
    .filter(Boolean)
    .join("\n\n");
  const lead = (sections.find((s) => s.text)?.text ?? "").slice(0, 420).trim();

  return { text, lead, headings, sections };
}

export function extractPostText(
  root: Element | null = typeof document !== "undefined"
    ? document.querySelector("[data-post-body]")
    : null,
): string {
  return extractPostOutline(root).text;
}
