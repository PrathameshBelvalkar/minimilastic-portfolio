import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

type Capability = {
  category: string;
  desc: string;
  items: string[];
};

type Props = {
  capabilities: Capability[];
};

export function CapabilitiesSection({ capabilities }: Props) {
  const { t } = useTranslation();
  const capabilityKeyByIndex = ['ai', 'backend', 'frontendDb'] as const;

  return (
    <section id="capabilities" className="mb-24 border-t border-theme pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-24"
      >
        <div className="flex flex-col gap-6">
          <h2 className="section-label">{t('capabilities.sectionHeading')}</h2>
          <h3 className="text-4xl md:text-6xl font-medium tracking-tight max-w-3xl leading-[1.1]">
            {t('capabilities.sectionSubheading')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {capabilities.map((cap, i) => {
            const key = capabilityKeyByIndex[i];
            const category = key ? t(`capabilities.${key}.category`) : cap.category;
            const desc = key ? t(`capabilities.${key}.desc`) : cap.desc;

            return (
            <div key={i} className="flex flex-col gap-8 group">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] opacity-40 uppercase tracking-[0.2em]">
                  0{i + 1} /
                </span>
                <h4 className="text-2xl font-medium">{category}</h4>
              </div>

              <p className="opacity-60 leading-relaxed font-light">{desc}</p>

              <div className="flex flex-wrap gap-2 pt-4">
                {cap.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 border border-theme rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

