import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import PageNotFoundIllustration from '../components/illustrations/PageNotFound.jsx';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="px-6 md:px-12 min-h-[calc(100vh-160px)] flex items-center justify-center max-w-7xl mx-auto">
      <motion.div
        className="flex flex-col items-center text-center w-full max-w-lg py-16 md:py-24"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <PageNotFoundIllustration
          className="w-[min(280px,85vw)] h-auto mb-12 md:mb-14 drop-shadow-sm"
          aria-hidden
        />

        <h1 className="font-sans font-extrabold text-[var(--color-text)] text-2xl sm:text-3xl md:text-[2rem] leading-tight tracking-[-0.03em] mb-4">
          Uh-oh... I think I took a wrong turn.
        </h1>

        <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed max-w-md mb-10">
          Let's get you back to where the cute things live.
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-full border border-theme bg-card-theme text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-all duration-300"
        >
          Go home
        </button>
      </motion.div>
    </main>
  );
}
