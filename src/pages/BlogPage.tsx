import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import Readingman from '../components/illustrations/Readingman';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { blogCategories, blogPosts } from '../blog';
import { BlogCard } from '../components/blog/BlogCard';
import { TrendingBlogCarousel } from '../components/blog/TrendingBlogCarousel';
import { applyBlogListingSeo } from '../seo';

const PAGE_SIZE = 3;

export default function BlogPage() {
  useEffect(() => {
    applyBlogListingSeo();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const activeCategory = searchParams.get('cat') ?? 'All';
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1'));

  function setParam(updates: Record<string, string>) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === '' || v === 'All' || v === '1') next.delete(k);
        else next.set(k, v);
      });
      return next;
    }, { replace: true });
  }

  function resetPage(updates: Record<string, string>) {
    setParam({ ...updates, page: '1' });
  }

  const trendingPosts = useMemo(() => blogPosts.slice(0, 5), []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      if (!q) return matchesCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  return (
    <>
    <main className="relative px-6 md:px-12 pt-30 pb-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-start border-b border-theme pb-12">
          <div className="flex flex-col gap-6 min-w-0">
            <span className="section-label">Writing</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.95] uppercase">
              Notes &<br />Articles
            </h1>
            <p className="text-lg opacity-60 font-light max-w-lg leading-relaxed">
              Thoughts on backend engineering, AI development, and the craft of building software that lasts.
            </p>
          </div>
          <div className="hidden lg:block min-w-0 w-full lg:pt-1">
            <TrendingBlogCarousel posts={trendingPosts} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => resetPage({ q: e.target.value })}
              placeholder="Search posts, tags..."
              className="w-full pl-10 pr-10 py-3 bg-card-theme border border-theme rounded-lg text-sm placeholder:opacity-40 focus:outline-none focus:border-[var(--color-text-muted)] transition-colors duration-200"
              style={{ color: 'var(--color-text)', background: 'var(--color-card-bg)' }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => resetPage({ q: '' })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => resetPage({ cat })}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
                    : 'border-theme hover:border-[var(--color-text-muted)] opacity-60 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto font-mono text-[10px] opacity-30 uppercase tracking-widest">
              {filtered.length} / {blogPosts.length}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-theme">
                  <button
                    onClick={() => setParam({ page: String(Math.max(1, currentPage - 1)) })}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-theme disabled:opacity-20 hover:border-[var(--color-text-muted)] transition-all duration-200 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setParam({ page: String(page) })}
                      className={`w-8 h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                        page === currentPage
                          ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
                          : 'border-theme opacity-50 hover:opacity-100 hover:border-[var(--color-text-muted)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setParam({ page: String(Math.min(totalPages, currentPage + 1)) })}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-theme disabled:opacity-20 hover:border-[var(--color-text-muted)] transition-all duration-200 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>

                  <span className="ml-2 font-mono text-[10px] opacity-30 uppercase tracking-widest">
                    {currentPage} / {totalPages}
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-24 text-center"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-30">
                No results
              </span>
              <p className="opacity-40 text-sm">
                No posts match "{searchQuery}"
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.
              </p>
              <button
                onClick={() => resetPage({ q: '', cat: 'All' })}
                className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity border-b border-[var(--color-text-muted)] pb-0.5"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  </>
  );
}
