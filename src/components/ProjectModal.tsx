import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { images, imagePaths } from '../assets/images';

export interface Project {
  title: string;
  desc: string;
  year: string;
  tech: string[];
  longDesc?: string;
}

type Props = {
  selectedProject: Project | null;
  onClose: () => void;
};

export function ProjectModal({ selectedProject, onClose }: Props) {
  return (
    <AnimatePresence>
      {selectedProject && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-24 bottom-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[var(--color-bg)] z-[101] overflow-y-auto border border-theme shadow-2xl"
          >
            <div className="flex flex-col">
              <div className="relative aspect-video bg-card-theme border-b border-theme flex items-center justify-center overflow-hidden">
                {imagePaths.length > 0 && (
                  <img
                    src={
                      images[
                        imagePaths[
                          Math.abs(
                            Array.from(selectedProject.title).reduce(
                              (acc, c) => acc + c.charCodeAt(0),
                              0,
                            ),
                          ) % imagePaths.length
                        ]
                      ]
                    }
                    alt={selectedProject.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                    loading="lazy"
                  />
                )}
                <span className="font-mono text-[10px] opacity-20 uppercase tracking-[0.2em]">
                  {selectedProject.title} / PREVIEW
                </span>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:opacity-50 transition-opacity bg-[var(--color-bg)] rounded-full border border-theme"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 md:p-14 flex flex-col gap-8">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-4xl font-extrabold tracking-tight uppercase italic">
                    {selectedProject.title}
                  </h2>
                  <span className="font-mono text-xs opacity-40">{selectedProject.year}</span>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="section-label text-[9px]">Description</h4>
                  <p className="text-xl font-light leading-relaxed opacity-80">
                    {selectedProject.longDesc || selectedProject.desc}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="section-label text-[9px]">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 bg-card-theme border border-theme rounded-full text-xs font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-8 px-10 py-5 bg-[var(--color-text)] text-[var(--color-bg)] font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity flex items-center justify-center gap-3">
                  View Project <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

