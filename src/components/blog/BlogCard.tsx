import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import type { BlogPost } from '../../blog';

type Props = {
  post: BlogPost;
  index: number;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BlogCard({ post, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/blog/${post.slug}`} className="group block h-full">
        <article className="h-full flex flex-col gap-5 p-6 border border-theme bg-card-theme rounded-xl transition-all duration-300 hover:border-[var(--color-text-muted)] hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span
              className="section-label px-2 py-1 rounded"
              style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)', border: '1px solid' }}
            >
              {post.category}
            </span>
            <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">
              {post.readTime} read
            </span>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-base font-bold leading-snug tracking-tight group-hover:opacity-70 transition-opacity">
              {post.title}
            </h3>
            <p className="text-sm leading-relaxed opacity-60 line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-theme rounded opacity-50"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-theme">
            <span className="font-mono text-[10px] opacity-40">
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" style={{ color: 'var(--color-accent)' }}>
              Read <ArrowRight size={10} />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
