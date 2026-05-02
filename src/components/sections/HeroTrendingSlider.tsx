import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { HeroTrendingLeadMarkdown } from '../blog/HeroTrendingLeadMarkdown';
import { getMdxLeadPreviewMarkdown, type BlogPost } from '../../blog';

type Props = {
  posts: readonly BlogPost[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function HeroTrendingSlider({ posts }: Props) {
  const { t } = useTranslation();
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
    <div className="h-full min-h-0 rounded-[1.35rem] border border-theme bg-[color-mix(in_oklab,var(--color-card-bg)_92%,transparent)] p-6 xl:p-8 backdrop-blur-md flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-theme pb-4 shrink-0">
        <span className="section-label text-[12px] xl:text-[13px] tracking-[0.16em]">{t('hero.trendingLabel')}</span>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/blog"
            className="text-[11px] xl:text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
          >
            {t('hero.trendingAllCta')}
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(-1)}
              className="p-2 rounded-lg border border-theme opacity-60 hover:opacity-100 transition-opacity bg-[var(--color-card-bg)]"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="p-2 rounded-lg border border-theme opacity-60 hover:opacity-100 transition-opacity bg-[var(--color-card-bg)]"
              aria-label="Next slide"
            >
              <ChevronRight size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-[min(200px,28vh)] overflow-hidden rounded-xl  bg-[var(--color-card-bg)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 p-6 xl:p-8 flex flex-col"
          >
            <div className="flex flex-col h-full min-h-0 gap-4 text-left">
              <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
                <span
                  className="section-label px-2.5 py-1 rounded shrink-0 text-[11px] xl:text-xs"
                  style={{
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-accent)',
                  }}
                >
                  {post.category}
                </span>
                <span className="font-mono text-[10px] xl:text-[11px] opacity-45 uppercase tracking-[0.12em] shrink-0">
                  {post.readTime} read
                </span>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="group/title block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
              >
                <h3 className="text-lg xl:text-xl 2xl:text-[1.35rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text)] group-hover/title:text-[var(--color-accent)] transition-colors line-clamp-4">
                  {post.title}
                </h3>
              </Link>
              <div className="flex-1 min-h-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]">
                <HeroTrendingLeadMarkdown markdown={getMdxLeadPreviewMarkdown(post.slug)} fallback={post.excerpt} />
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="group/foot flex items-center justify-between pt-4 border-t border-theme gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
              >
                <span className="font-mono text-[10px] xl:text-[11px] text-[var(--color-text-muted)]">{formatDate(post.date)}</span>
                <span className="flex items-center gap-1 text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)] opacity-70 group-hover/foot:opacity-100 group-hover/foot:translate-x-0.5 transition-all">
                  Read <ArrowRight size={12} strokeWidth={2} />
                </span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {n > 1 && (
        <div className="flex justify-center gap-1.5 pt-0.5 shrink-0" role="tablist" aria-label="Trending slides">
          {posts.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === safeIndex ? 'w-7 bg-[var(--color-accent)]' : 'w-1.5 bg-[var(--color-text-muted)] opacity-35 hover:opacity-60'
              }`}
              aria-label={`Show ${p.title}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
