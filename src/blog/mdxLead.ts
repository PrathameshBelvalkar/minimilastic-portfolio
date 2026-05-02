const rawModules = import.meta.glob('./posts/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const cache = new Map<string, string>();

const PREVIEW_SECTION_COUNT = 9999;

function resolveRawImport(mod: unknown): string {
  if (typeof mod === 'string') return mod;
  if (mod && typeof mod === 'object' && 'default' in mod) {
    const d = (mod as { default: unknown }).default;
    if (typeof d === 'string') return d;
  }
  return '';
}

function normalizeNewlines(s: string): string {
  return s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function stripFrontmatter(raw: string): string {
  const s = normalizeNewlines(raw);
  const m = s.match(/^---\n[\s\S]*?\n---\s*\n([\s\S]*)/);
  return m ? m[1] : s.trimStart();
}

function extractPreviewMarkdown(raw: string): string {
  const body = stripFrontmatter(raw).trimStart();
  if (!body) return '';
  const parts = body.split(/\n(?=## )/);
  const slice = parts.slice(0, PREVIEW_SECTION_COUNT);
  return slice
    .map((chunk) => chunk.replace(/^##[^\n]*\n+/, '').trim())
    .filter(Boolean)
    .join('\n\n');
}

export function getMdxLeadPreviewMarkdown(slug: string): string {
  const hit = cache.get(slug);
  if (hit !== undefined) return hit;
  const pathKey = `./posts/${slug}.mdx`;
  const raw = resolveRawImport(rawModules[pathKey]);
  const text = raw ? extractPreviewMarkdown(raw) : '';
  cache.set(slug, text);
  return text;
}
