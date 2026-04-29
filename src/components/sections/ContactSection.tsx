import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

type ContactLink = Readonly<{ label: string; href: string }>;

type Props = {
  email: string;
  links: readonly ContactLink[];
};

export function ContactSection({ email, links }: Props) {
  const { t } = useTranslation();
  return (
    <section id="contact" className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-16"
      >
        <h2 className="section-label">{t('contact.sectionLabel')}</h2>

        <div className="flex flex-col gap-12">
          <p className="text-3xl md:text-5xl font-light tracking-tight hover:opacity-50 cursor-pointer transition-opacity break-all">
            {email}
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-widest border-b border-transparent hover:border-[var(--color-text)] transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

