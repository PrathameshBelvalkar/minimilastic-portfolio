import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="px-6 md:px-12 min-h-[calc(100vh-160px)] flex items-center max-w-7xl mx-auto">
      <div className="w-full py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label mb-8">Error</p>

          <div className="relative">
            <motion.h1
              className="display-title select-none"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[var(--color-text)]">4</span>
              <span
                className="relative inline-block text-transparent"
                style={{ WebkitTextStroke: '2px var(--color-text)' }}
              >
                0
                <motion.span
                  className="absolute inset-0 flex items-center justify-center text-[var(--color-accent)]"
                  style={{ WebkitTextStroke: '0px', fontSize: 'inherit', fontWeight: 'inherit' }}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  0
                </motion.span>
              </span>
              <span className="text-[var(--color-text)]">4</span>
            </motion.h1>

            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
              style={{
                originX: 0,
                background: 'var(--color-text)',
              }}
            />
          </div>

          <motion.div
            className="mt-10 max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed tracking-wide">
              This page doesn't exist or has been moved.
              <br />
              Let's get you back on track.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-3 px-6 py-3 border border-theme rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-all duration-300"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
              Back to Home
            </button>

            <a
              href="#contact"
              onClick={() => navigate('/')}
              className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-40 hover:opacity-100 transition-opacity duration-300"
            >
              Contact
            </a>
          </motion.div>

          <motion.div
            className="mt-16 pt-8 border-t border-theme flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="font-mono text-[10px] opacity-30">STATUS</span>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="font-mono text-[10px] opacity-40">PAGE NOT FOUND</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
