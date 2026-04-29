import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

type Props = {
  sectionLabel: string;
  headline: string;
  focusAreas: readonly string[];
  emailLabel: string;
  email: string;
  linkedinLabel: string;
  linkedinCtaLabel: string;
  linkedinHref: string;
  paragraphs: readonly string[];
};

export function AboutProfileSection({
  sectionLabel,
  headline,
  focusAreas,
  emailLabel,
  email,
  linkedinLabel,
  linkedinCtaLabel,
  linkedinHref,
  paragraphs,
}: Props) {
  return (
    <section className="mb-32 md:mb-48 border-t border-theme pt-8 md:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-label mb-12">{sectionLabel}</h2>
        <div className="w-full h-[1px] bg-theme mb-12 md:mb-24 opacity-20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col justify-between gap-12 lg:gap-24">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight max-w-2xl">
              {headline}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 text-sm min-w-0">
              <div className="flex flex-col gap-1 min-w-0">
                {(focusAreas.slice(0, 2).length ? focusAreas.slice(0, 2) : ['']).map((area) => (
                  <p key={area} className="font-medium">
                    {area}
                  </p>
                ))}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="opacity-40">{emailLabel}</p>
                <a
                  href={`mailto:${email}`}
                  className="border-b border-[var(--color-text)] pb-0.5 hover:opacity-50 transition-opacity self-start break-all max-w-full"
                >
                  {email}
                </a>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="font-medium opacity-40">{linkedinLabel}</p>
                <a
                  href={linkedinHref}
                  className="border-b border-[var(--color-text)] pb-0.5 hover:opacity-50 transition-opacity flex items-center gap-1 self-start min-w-0"
                >
                  <span className="truncate max-w-full">{linkedinCtaLabel}</span> <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 text-lg md:text-xl opacity-80 font-light leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

