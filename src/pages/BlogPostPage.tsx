import { ArrowLeft, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { blogPosts, getBlogPostComponent } from '../blog';
import { MermaidDiagram } from '../components/blog/MermaidDiagram';
import SittingReading from '../components/illustrations/SittingReading';
import { applyBlogPostSeo, applyDefaultSeo } from '../seo';
import NotFoundPage from './NotFoundPage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>;
type MDXContentComponent = React.ComponentType<{ components?: MDXComponents }>;

type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  if (React.isValidElement(node))
    return getTextContent((node.props as { children?: React.ReactNode }).children);
  return '';
}

function MdxPreWithCopy({ children, ...props }: React.ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false);
  const raw = getTextContent(children);

  const handleCopy = () => {
    void navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative mb-8">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-theme bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)] hover:border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        {copied ? <Check size={14} strokeWidth={2} aria-hidden /> : <Copy size={14} strokeWidth={2} aria-hidden />}
      </button>
      <pre
        className="overflow-x-auto rounded-xl border border-theme px-5 pt-11 pb-4 text-[0.82rem] leading-[1.75] font-mono"
        style={{ background: 'var(--color-card-bg)' }}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

function buildMdxComponents(): MDXComponents {
  return {
    h1: ({ children, ...props }) => {
      const id = slugify(getTextContent(children));
      return (
        <h1
          id={id}
          className="font-extrabold tracking-tight leading-tight mt-14 mb-5 pt-6 border-t border-theme scroll-mt-28"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-text)' }}
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = slugify(getTextContent(children));
      return (
        <h2
          id={id}
          className="font-bold tracking-tight mt-12 mb-4 scroll-mt-28"
          style={{ fontSize: 'clamp(1.3rem, 3vw, 1.65rem)', color: 'var(--color-text)' }}
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = slugify(getTextContent(children));
      return (
        <h3
          id={id}
          className="font-semibold mt-8 mb-3 uppercase tracking-[0.1em] scroll-mt-28"
          style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}
          {...props}
        >
          {children}
        </h3>
      );
    },
    p: ({ children, ...props }) => (
      <p
        className="leading-[1.85] mb-5"
        style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}
        {...props}
      >
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="space-y-2 mb-6 pl-1" style={{ color: 'var(--color-text-secondary)' }} {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 pl-1" style={{ color: 'var(--color-text-secondary)' }} {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed flex gap-2 items-start" {...props}>
        <span className="mt-[0.35em] shrink-0 opacity-30" style={{ color: 'var(--color-text)' }}>—</span>
        <span>{children}</span>
      </li>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-bold" style={{ color: 'var(--color-text)' }} {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic" style={{ color: 'var(--color-text)' }} {...props}>
        {children}
      </em>
    ),
    code: ({ className, children, ...props }) => {
      const isBlock = className?.includes('hljs') || className?.includes('language-');
      if (isBlock) return <code className={className} {...props}>{children}</code>;
      return (
        <code
          className="font-mono text-[0.82em] px-1.5 py-0.5 rounded bg-card-theme border border-theme"
          style={{ color: 'var(--color-accent)' }}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => {
      const child = React.Children.only(children) as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      const lang = child?.props?.className ?? '';
      if (lang.includes('language-mermaid')) {
        const code = String(child?.props?.children ?? '').trim();
        return <MermaidDiagram code={code} />;
      }
      return <MdxPreWithCopy {...props}>{children}</MdxPreWithCopy>;
    },
    img: ({ src, alt, ...props }) => (
      <figure className="my-8">
        <img
          src={src}
          alt={alt}
          className="rounded-xl border border-theme w-full object-cover"
          loading="lazy"
          decoding="async"
          {...props}
        />
        {alt && (
          <figcaption className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-widest opacity-40">
            {alt}
          </figcaption>
        )}
      </figure>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-2 pl-5 my-7 italic text-base leading-relaxed"
        style={{ borderColor: 'var(--color-accent)', color: 'var(--color-text-secondary)' }}
        {...props}
      >
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-theme my-10" />,
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="border-b hover:opacity-60 transition-opacity"
        style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
  };
}

const mdxComponents = buildMdxComponents();

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  if (!items.length) return null;
  return (
    <nav className="flex flex-col gap-0.5">
      <span className="section-label mb-4" style={{ fontSize: '11px' }}>On this page</span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`leading-snug transition-all duration-200 py-1 border-l-2 ${
            item.level === 3 ? 'pl-4 text-[12px]' : 'pl-3 text-[13px]'
          } ${
            activeId === item.id
              ? 'font-semibold border-[var(--color-accent)]'
              : 'border-transparent opacity-40 hover:opacity-75'
          }`}
          style={activeId === item.id ? { color: 'var(--color-accent)' } : { color: 'var(--color-text)' }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [PostContent, setPostContent] = useState<MDXContentComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) applyBlogPostSeo(post);
    else applyDefaultSeo();
  }, [post]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setToc([]);
    setActiveId('');
    getBlogPostComponent(slug).then((component) => {
      setPostContent(() => component as MDXContentComponent);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (loading || !contentRef.current) return;
    const els = contentRef.current.querySelectorAll<HTMLElement>('h2[id], h3[id]');
    const items: TocItem[] = Array.from(els).map((el) => ({
      id: el.id,
      text: el.textContent ?? '',
      level: el.tagName === 'H2' ? 2 : 3,
    }));
    setToc(items);
    if (items.length) setActiveId(items[0].id);
  }, [loading]);

  useEffect(() => {
    if (!toc.length) return;

    const updateActive = () => {
      const innerH = window.innerHeight;
      const line = Math.max(112, innerH * 0.33);
      const docEl = document.documentElement;
      const scrollRoom = docEl.scrollHeight - innerH;
      const nearBottom =
        scrollRoom > 96 && window.scrollY + innerH >= docEl.scrollHeight - 96;

      let current = toc[0].id;
      if (nearBottom) {
        current = toc[toc.length - 1].id;
      } else {
        for (const { id } of toc) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
      }
      setActiveId(current);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [toc]);

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <>
    <main className="px-6 md:px-12 pt-30 pb-24 max-w-7xl mx-auto flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/blog" className="flex items-center gap-2 section-label hover:opacity-100 transition-opacity self-start">
          <ArrowLeft size={12} /> Back to Blog
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,640px)_200px] xl:grid-cols-[minmax(0,680px)_220px] gap-12 xl:gap-20">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="section-label px-2 py-1 rounded border"
                  style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                >
                  {post.category}
                </span>
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">
                  {post.readTime} read
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
                {post.title}
              </h1>

              <p className="text-base opacity-60 leading-relaxed">{post.excerpt}</p>

              <div className="flex items-center gap-4 pt-1 flex-wrap">
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">
                  {formatDate(post.date)}
                </span>
                <span className="w-1 h-1 rounded-full opacity-30 bg-[var(--color-text)]" />
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded transition-all duration-200 cursor-default"
                      style={{
                        background: 'color-mix(in oklab, var(--color-accent) 12%, transparent)',
                        color: 'var(--color-accent)',
                        border: '1px solid color-mix(in oklab, var(--color-accent) 35%, transparent)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div ref={contentRef}>
              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse mt-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-4 rounded bg-card-theme" style={{ width: `${88 - i * 6}%` }} />
                  ))}
                </div>
              ) : PostContent ? (
                <PostContent components={mdxComponents} />
              ) : (
                <p className="opacity-40">Failed to load post content.</p>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              {loading ? null : <TableOfContents items={toc} activeId={activeId} />}
            </div>
          </aside>
      </div>
    </main>

    <div className="hidden lg:block fixed bottom-0 right-0 pointer-events-none select-none z-0" aria-hidden>
      <SittingReading className="w-64 h-64 opacity-10" />
    </div>
    </>
  );
}
