import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Project } from '../ProjectModal';
import { projectImageKeys, projectImages } from '../../assets/images';

type Props = {
  projects: Project[];
  onSelectProject: (p: Project) => void;
};

export function ProjectsSection({ projects, onSelectProject }: Props) {
  return (
    <section id="projects" className="mb-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-16"
      >
        <div className="flex justify-between items-baseline">
          <h2 className="section-label">Projects</h2>
          <span className="font-mono text-[10px] opacity-40">TOTAL / 04</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              onClick={() => onSelectProject(project)}
              className="flex flex-col gap-6 cursor-pointer group"
            >
              <div className="relative aspect-[4/3] bg-card-theme flex items-center justify-center border border-theme overflow-hidden">
                {((project.image &&
                  projectImages[project.image as keyof typeof projectImages]) ||
                  (projectImageKeys[0] && projectImages[projectImageKeys[0]])) && (
                  <img
                    src={
                      (project.image &&
                        projectImages[project.image as keyof typeof projectImages]) ||
                      projectImages[projectImageKeys[0]]
                    }
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity"
                    loading="lazy"
                  />
                )}
                {/* <span className="font-mono text-[10px] opacity-20 uppercase tracking-[0.2em]">
                  Preview / {project.title}
                </span> */}
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {project.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="opacity-60 leading-relaxed max-w-sm text-sm">{project.desc}</p>
                </div>
                <span className="font-mono text-[10px] opacity-40">{project.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

