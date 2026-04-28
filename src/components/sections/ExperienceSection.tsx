import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

type Experience = {
  company: string;
  tagline: string;
  period: string;
  position: string;
  location: string;
  industry: string;
  website: string;
  description: string[];
};

type Props = {
  experience: Experience[];
};

export function ExperienceSection({ experience }: Props) {
  return (
    <section id="experience" className="mb-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-24"
      >
        <h2 className="section-label">Selected Experience</h2>

        <div className="flex flex-col gap-32">
          {experience.map((job, i) => (
            <div key={i} className="flex flex-col gap-12 border-t border-theme pt-12 first:border-none first:pt-0">
              <h3 className="text-5xl md:text-8xl font-medium tracking-tight">{job.company}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32">
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg md:text-xl font-normal">{job.tagline}</p>
                    <p className="text-lg md:text-xl font-normal opacity-60">{job.period}</p>
                  </div>

                  <div className="flex flex-col gap-8 text-lg font-light leading-relaxed opacity-80 max-w-xl">
                    {job.description.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col pt-1">
                  {[
                    { label: 'Position', value: job.position },
                    { label: 'Location', value: job.location },
                    { label: 'Industry', value: job.industry },
                    { label: 'Website', value: job.website, isLink: true }
                  ].map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 py-4 border-b border-theme last:border-none items-baseline">
                      <span className="text-sm md:text-base opacity-40 font-light">{item.label}</span>
                      <div className="text-right">
                        {item.isLink ? (
                          <a
                            href={`https://${item.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm md:text-base border-b border-[var(--color-text)] pb-0.5 hover:opacity-50 transition-opacity inline-flex items-center gap-1"
                          >
                            {item.value} <ArrowUpRight size={12} />
                          </a>
                        ) : (
                          <span className="text-sm md:text-base font-light">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

