import type { Components } from 'react-markdown';
import Markdown from 'react-markdown';

type Props = {
  markdown: string;
  fallback: string;
};

const components: Components = {
  p: ({ children }) => (
    <p className="text-[0.9375rem] xl:text-base leading-[1.65] text-[var(--color-text-secondary)] mb-3 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--color-text)]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-[var(--color-text-secondary)]">{children}</em>,
  code: ({ className, children, ...props }) => {
    const text = String(children).replace(/\n$/, '');
    const isBlock = Boolean(className?.includes('language-')) || text.includes('\n');
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="font-mono text-[0.85em] px-1.5 py-0.5 rounded border border-theme bg-[var(--color-card-bg)] text-[var(--color-accent)]"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 max-h-52 overflow-auto rounded-lg border border-theme bg-[var(--color-card-bg)] p-3 text-[10px] xl:text-[11px] leading-relaxed font-mono text-[var(--color-text-secondary)] whitespace-pre">
      {children}
    </pre>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 space-y-1.5 pl-4 list-disc text-[0.9375rem] text-[var(--color-text-secondary)] marker:text-[var(--color-text-muted)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 space-y-1.5 pl-5 list-decimal text-[0.9375rem] text-[var(--color-text-secondary)] marker:font-mono marker:text-[11px]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ children }) => (
    <span className="underline underline-offset-2 decoration-[color-mix(in_oklab,var(--color-accent)_45%,transparent)] text-[var(--color-accent)]">
      {children}
    </span>
  ),
  h1: ({ children }) => (
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-secondary)] mb-2">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-secondary)] mb-2">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-secondary)] mb-2 mt-1">{children}</p>
  ),
  hr: () => <hr className="my-3 border-theme" />,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-[var(--color-accent)] pl-3 text-[var(--color-text-secondary)] text-[0.9rem] italic">
      {children}
    </blockquote>
  ),
};

export function HeroTrendingLeadMarkdown({ markdown, fallback }: Props) {
  const source = markdown.trim().length > 0 ? markdown : fallback;
  return <Markdown components={components}>{source}</Markdown>;
}
