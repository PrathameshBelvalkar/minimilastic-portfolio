import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '../motionVariants';

export function HeroSection() {
  return (
    <section id="about" className="min-h-[80vh] flex flex-col">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="flex flex-col gap-12"
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
      </motion.div>
    </section>
  );
}

