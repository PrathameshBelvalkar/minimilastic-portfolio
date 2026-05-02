import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { BlogPost } from '../../blog';

type Props = {
  posts: BlogPost[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TrendingBlogCarousel({ posts }: Props) {
  const [index, setIndex] = useState(0);
  const n = posts.length;
  const safeIndex = n === 0 ? 0 : index % n;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n === 0) return;
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  useEffect(() => {
    if (n <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % n), 6000);
    return () => window.clearInterval(id);
  }, [n]);

  if (n === 0) return null;

  const post = posts[safeIndex];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between gap-3">
        <span className="section-label" style={{ fontSize: '11px' }}>
          Trending
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(-1)}
            className="p-2 rounded-lg border border-theme opacity-50 hover:opacity-100 transition-opacity bg-[var(--color-card-bg)]"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="p-2 rounded-lg border border-theme opacity-50 hover:opacity-100 transition-opacity bg-[var(--color-card-bg)]"
            aria-label="Next slide"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-theme bg-card-theme min-h-[200px] md:min-h-[220px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 p-6 flex flex-col"
          >
            <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full gap-4">
              <div className="flex items-center justify-between gap-3">
                <span
                  className="section-label px-2 py-1 rounded shrink-0"
                  style={{
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-accent)',
                  }}
                >
                  {post.category}
                </span>
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest shrink-0">
                  {post.readTime} read
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold leading-snug tracking-tight group-hover:opacity-70 transition-opacity line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed opacity-60 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-theme mt-auto">
                <span className="font-mono text-[10px] opacity-40">{formatDate(post.date)}</span>
                <span
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Read <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {n > 1 && (
        <div className="flex justify-center gap-1.5" role="tablist" aria-label="Trending slides">
          {posts.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === safeIndex ? 'w-6 bg-[var(--color-accent)]' : 'w-1.5 bg-[var(--color-text-muted)] opacity-35 hover:opacity-60'
              }`}
              aria-label={`Show ${p.title}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
