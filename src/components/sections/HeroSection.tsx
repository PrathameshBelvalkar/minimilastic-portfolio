import { AnimatePresence, motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '../motionVariants';

type Props = {
  hideScrollHint?: boolean;
};

export function HeroSection({ hideScrollHint }: Props) {
  return (
    <section id="about" className="min-h-[80vh] flex flex-col">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="relative flex flex-col gap-12"
      >
        <motion.h1 variants={fadeInUp} className="display-title">
          ALEX
          <br />
          CARTER
        </motion.h1>

        <motion.div variants={fadeInUp} className="max-w-xl flex flex-col gap-6">
          <h2 className="section-label">Who am I</h2>
          <p className="text-xl md:text-2xl font-light leading-relaxed opacity-80">
            Independent Developer and Product Designer specializing in building minimalist, high-performance
            web interfaces that prioritize clarity and user intent.
          </p>
          <p className="text-lg font-normal opacity-60">
            Currently exploring the intersection of Generative AI and Human-Computer Interaction.
          </p>
        </motion.div>

        <AnimatePresence>
          {!hideScrollHint && (
            <motion.a
              variants={fadeInUp}
              href="#experience"
              className="mt-10 inline-flex items-center gap-4 self-start opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Scroll to bottom"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                aria-hidden="true"
                className="w-6 h-10 rounded-full border border-[var(--color-text-secondary)] flex items-start justify-center pt-2"
              >
                <motion.div
                  className="w-1 h-2 rounded-full bg-[var(--color-text-secondary)]"
                  animate={{ y: [0, 8, 0], opacity: [0.9, 0.35, 0.9] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
            </motion.a>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

