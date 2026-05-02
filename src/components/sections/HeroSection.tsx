import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { BlogPost } from '../../blog';
import { fadeInUp, staggerContainer } from '../motionVariants';
import { HeroTrendingSlider } from './HeroTrendingSlider';

type Props = {
  hideScrollHint?: boolean;
  titleLines: readonly string[];
  scrollCtaHref: string;
  trendingPosts?: readonly BlogPost[];
};

export function HeroSection({
  hideScrollHint,
  titleLines,
  scrollCtaHref,
  trendingPosts,
}: Props) {
  const { t } = useTranslation();
  const showTrending = Boolean(trendingPosts?.length);

  return (
    <section id="home" className="min-h-[85vh] flex flex-col">
      <div
        className={
          showTrending
            ? 'relative flex flex-1 flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(26rem,1fr)] lg:items-stretch lg:gap-x-8 xl:gap-x-12 2xl:gap-x-12 lg:min-h-[min(85vh,56rem)]'
            : 'relative flex flex-1 flex-col gap-12'
        }
      >
        <motion.div
          variants={staggerContainer} 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative flex flex-col gap-12 min-w-0 lg:py-1"
        >
          <motion.h1 variants={fadeInUp} className="display-title">
            {titleLines[0] ?? ''}
            <br />
            {titleLines[1] ?? ''}
          </motion.h1>

          <motion.div variants={fadeInUp} className="max-w-xl flex flex-col gap-6">
            <h2 className="section-label">{t('hero.whoAmILabel')}</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed opacity-80">
              {t('hero.intro')}
            </p>
            <p className="text-lg font-normal opacity-60">{t('hero.subIntro')}</p>
          </motion.div>

          <AnimatePresence>
            {!hideScrollHint && (
              <motion.a
                variants={fadeInUp}
                href={scrollCtaHref}
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
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t('hero.scrollCtaLabel')}</span>
              </motion.a>
            )}
          </AnimatePresence>
        </motion.div>

        {showTrending && trendingPosts && (
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="hidden lg:flex h-full w-full min-h-0 min-w-0 flex-col"
          >
            <HeroTrendingSlider posts={trendingPosts} />
          </motion.aside>
        )}
      </div>
    </section>
  );
}
