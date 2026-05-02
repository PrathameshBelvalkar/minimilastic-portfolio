import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { blogPosts, getBlogPostComponent } from '../blog';

type MDXComponents = Record<string, React.ComponentType<React.HTMLAttributes<HTMLElement> & { href?: string }>>;
type MDXContentComponent = React.ComponentType<{ components?: MDXComponents }>;

const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className="font-extrabold tracking-tight leading-tight mt-14 mb-5 pt-6 border-t border-theme"
      style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-text)' }}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="font-bold tracking-tight mt-12 mb-4"
      style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', color: 'var(--color-text)' }}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="font-semibold mt-8 mb-3 uppercase tracking-[0.1em]"
      style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p
      className="text-base leading-[1.85] mb-5"
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
    if (isBlock) {
      return <code className={className} {...props}>{children}</code>;
    }
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
  pre: ({ children, ...props }) => (
    <pre
      className="overflow-x-auto rounded-xl border border-theme px-5 py-4 mb-8 text-[0.82rem] leading-[1.75] font-mono"
      style={{ background: 'var(--color-card-bg)' }}
      {...props}
    >
      {children}
    </pre>
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [PostContent, setPostContent] = useState<MDXContentComponent | null>(null);
  const [loading, setLoading] = useState(true);

  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getBlogPostComponent(slug).then((component) => {
      setPostContent(() => component as MDXContentComponent);
      setLoading(false);
    });
  }, [slug]);

  if (!post) {
    return (
      <main className="px-6 md:px-12 pt-30 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 items-start">
          <Link to="/blog" className="flex items-center gap-2 section-label hover:opacity-100 transition-opacity">
            <ArrowLeft size={12} /> Back to Blog
          </Link>
          <p className="opacity-40 mt-8">Post not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 pt-30 pb-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5"
      >
        <Link to="/blog" className="flex items-center gap-2 section-label hover:opacity-100 transition-opacity self-start">
          <ArrowLeft size={12} /> Back to Blog
        </Link>

        <div className="border-b border-theme  flex flex-col gap-4 max-w-2xl">
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

          <div className="flex items-center gap-4 pt-2">
            <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">
              {formatDate(post.date)}
            </span>
            <span className="w-1 h-1 rounded-full opacity-30 bg-[var(--color-text)]" />
            <div className="flex gap-1.5 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-theme rounded opacity-50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-card-theme" style={{ width: `${85 - i * 5}%` }} />
              ))}
            </div>
          ) : PostContent ? (
            <PostContent components={mdxComponents} />
          ) : (
            <p className="opacity-40">Failed to load post content.</p>
          )}
        </div>
      </motion.div>
    </main>
  );
}
