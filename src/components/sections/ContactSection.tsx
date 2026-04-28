import { motion } from 'motion/react';

export function ContactSection() {
  return (
    <section id="contact" className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-16"
      >
        <h2 className="section-label">Connect</h2>

        <div className="flex flex-col gap-12">
          <p className="text-3xl md:text-5xl font-light tracking-tight hover:opacity-50 cursor-pointer transition-opacity break-all">
            hello@alexcarter.dev
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {['LinkedIn', 'GitHub', 'Twitter', 'Bento', 'Read.cv'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs font-semibold uppercase tracking-widest border-b border-transparent hover:border-[var(--color-text)] transition-all"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

