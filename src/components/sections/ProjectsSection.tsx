import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../ProjectModal';
import { projectImageKeys, projectImages } from '../../assets/images';

type Props = {
  projects: Project[];
  onSelectProject: (p: Project) => void;
};

function getProjectImageSrc(imageKey?: string) {
  if (imageKey && imageKey in projectImages) {
    return projectImages[imageKey as keyof typeof projectImages];
  }
  return projectImageKeys[0] ? projectImages[projectImageKeys[0]] : undefined;
}

export function ProjectsSection({ projects, onSelectProject }: Props) {
  const { t } = useTranslation();

  const projectKeyByTitle: Record<string, string> = {
    'Stream Deck': 'streamDeck',
    'National Buying Consortium': 'nbc',
    'Carbon Exchange AI': 'carbonExchange',
    'Video Personal Discussion (KYC)': 'vpd',
  };

  return (
    <section id="projects" className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-16"
      >
        <div className="flex justify-between items-baseline">
          <h2 className="section-label">{t('projects.sectionHeading')}</h2>
          <span className="font-mono text-[10px] opacity-40">TOTAL / 04</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {projects.map((project, i) => {
            const key = projectKeyByTitle[project.title];
            const desc = key ? t(`projects.${key}.desc`) : project.desc;
            const imageSrc = getProjectImageSrc(project.image);

            return (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              onClick={() => onSelectProject(project)}
              className="flex flex-col gap-6 cursor-pointer group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-theme bg-[#ececef] transition-colors duration-300 group-hover:border-[var(--color-text-muted)]">
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {project.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="opacity-60 leading-relaxed max-w-sm text-sm">{desc}</p>
                </div>
                <span className="font-mono text-[10px] opacity-40">{project.year}</span>
              </div>
            </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
