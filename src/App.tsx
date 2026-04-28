/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Sun, Moon, Menu, X, ArrowUp, ChevronDown } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface Project {
  title: string;
  desc: string;
  year: string;
  tech: string[];
  longDesc?: string;
}

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M18 12a6 6 0 1 1-12 0a6 6 0 0 1 12 0"/><path fill="currentColor" fillRule="evenodd" d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M1.25 12a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m19 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75M12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75" clipRule="evenodd"/><path fill="currentColor" d="M4.398 4.398a.75.75 0 0 1 1.061 0l.393.393a.75.75 0 0 1-1.06 1.06l-.394-.392a.75.75 0 0 1 0-1.06m15.202 0a.75.75 0 0 1 0 1.06l-.392.393a.75.75 0 0 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.06 0m-1.453 13.748a.75.75 0 0 1 1.061 0l.393.393a.75.75 0 0 1-1.06 1.06l-.394-.392a.75.75 0 0 1 0-1.06m-12.295 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 1 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.06 0" opacity="0.5"/></svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10c0-.463-.694-.54-.933-.143a6.5 6.5 0 1 1-8.924-8.924C12.54 2.693 12.463 2 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10"/></svg>
);

const EveningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M7.25 22a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M1.25 12a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m19 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75M6.083 15.25H2a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5z" clipRule="evenodd"/><path fill="currentColor" d="M4.25 19a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75m.148-14.602a.75.75 0 0 1 1.061 0l.393.393a.75.75 0 0 1-1.06 1.06l-.394-.392a.75.75 0 0 1 0-1.06m15.202 0a.75.75 0 0 1 0 1.06l-.392.393a.75.75 0 0 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.06 0M5.25 12c0 1.178.302 2.286.833 3.25h11.834A6.75 6.75 0 1 0 5.25 12" opacity="0.5"/></svg>
);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'evening' | 'dark'>('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentLang, setCurrentLang] = useState('EN');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'EN', flag: 'US', label: 'English' },
    { code: 'JP', flag: 'JP', label: 'Japanese' },
    { code: 'MR', flag: 'IN', label: 'Marathi' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        // Show button when the top of Projects section reaches or passes the top of the viewport
        setShowBackToTop(rect.top <= 0);
      } else {
        setShowBackToTop(window.scrollY > 1000);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'evening');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'evening') {
      root.classList.add('evening');
    }
  }, [theme]);

  useEffect(() => {
    if (isMenuOpen || selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen, selectedProject]);

  const projects: Project[] = [
    { 
      title: 'Linear Clone', 
      desc: 'A pixel-perfect task management interface built with React and Tailwind.', 
      year: '2023',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
      longDesc: 'A deep dive into complex UI patterns, focusing on keyboard navigation, optimistic updates, and fluid animations. Built to demonstrate high-level frontend architecture and attention to micro-interactions.'
    },
    { 
      title: 'Synth UI', 
      desc: 'Custom audio component library for modular visual synthesizers.', 
      year: '2023',
      tech: ['Web Audio API', 'React', 'TypeScript', 'D3.js', 'Canvas'],
      longDesc: 'A specialized library for building modular synth interfaces in the browser. Includes custom-built knobs, sliders, and oscilloscope components with real-time audio visualization.'
    },
    { 
      title: 'Type.io', 
      desc: 'Minimalist markdown editor with focus mode and export capabilities.', 
      year: '2022',
      tech: ['Next.js', 'ProseMirror', 'Markdown-IT', 'Supabase'],
      longDesc: 'A writer-centric editor designed to eliminate distractions. Features semi-transparent overlays, custom typography rendering, and automated cloud synchronization with offline support.'
    },
    { 
      title: 'Canvas Engine', 
      desc: 'A lightweight 2D rendering engine for complex browser animations.', 
      year: '2021',
      tech: ['WebGL', 'JavaScript', 'Geometry API', 'Web Workers'],
      longDesc: 'An exploration into low-level graphics programming. Developed a custom batch-rendering system that handles thousands of moving sprites at 60fps with minimal memory overhead.'
    },
  ];

  const navItems = ['About', 'Capabilities', 'Experience', 'Projects', 'Contact'];

  const capabilities = [
    {
      category: 'Frontend Engineering',
      desc: 'Building performant, scalable web applications with modern architectures.',
      items: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebGL/Three.js']
    },
    {
      category: 'Product Design',
      desc: 'Creating intuitive user journeys and high-fidelity interfaces with absolute precision.',
      items: ['Figma', 'Prototyping', 'Design Systems', 'UX Research', 'Accessibility']
    },
    {
      category: 'Technical Strategy',
      desc: 'Bridging the gap between design vision and technical implementation.',
      items: ['System Architecture', 'CI/CD Pipelines', 'Performance Audits', 'SEO Optimization', 'API Design']
    }
  ];
  const experience = [
    { 
      company: 'Starling Bank', 
      tagline: 'Award winning digital bank', 
      period: '2023 — 2025',
      position: 'Software Engineer',
      location: 'London, United Kingdom',
      industry: 'Banking',
      website: 'www.starlingbank.com',
      description: [
        'As a member of the Frontend Foundations team working on the Online Bank, I develop customer-facing features and integrate the design system to ensure a seamless and accessible user experience.',
        'Starling Bank is an award-winning, digital challenger bank disrupting the financial services industry with its transparent and customer-focused approach to banking.'
      ]
    },
    { 
      company: 'Crowdhäus', 
      tagline: 'Property discovery application', 
      period: '2021 — 2022',
      position: 'Software Engineer',
      location: 'London, United Kingdom',
      industry: 'Real Estate',
      website: 'www.crowdhaus.com',
      description: [
        'I have worked on and helped design key application features, including authentication, in-app messaging, property details, and a supporting web application.',
        'Crowdhaus was a property discovery application with 25,000+ downloads and 400+ five-star reviews, which allowed users across the United Kingdom to discover homes to buy and rent.'
      ]
    },
  ];

  return (
    <div className="min-h-screen pb-32 transition-colors duration-300">
      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-24 bottom-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[var(--color-bg)] z-[101] overflow-y-auto border border-theme shadow-2xl"
            >
              <div className="sticky top-0 right-0 p-6 flex justify-end">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:opacity-50 transition-opacity bg-[var(--color-bg)] rounded-full border border-theme"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-8 pb-16 md:px-16 flex flex-col gap-12">
                <div className="aspect-video bg-card-theme border border-theme flex items-center justify-center">
                  <span className="font-mono text-[10px] opacity-20 uppercase tracking-[0.2em]">{selectedProject.title} / PREVIEW</span>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-4xl font-extrabold tracking-tight uppercase italic">{selectedProject.title}</h2>
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
                        <span key={t} className="px-3 py-1.5 bg-card-theme border border-theme rounded-full text-xs font-semibold">
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

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-500 ${isScrolled && !isMenuOpen ? 'bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-theme shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="z-50 min-w-[120px]"
        >
          <AnimatePresence mode="wait">
            {isScrolled ? (
              <motion.a 
                key="name"
                href="#" 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="font-bold text-xs uppercase tracking-widest hover:opacity-50 transition-all block"
              >
                Alex Carter
              </motion.a>
            ) : null}
          </AnimatePresence>
        </motion.div>
        
        <div className="flex items-center gap-8">
          {/* Desktop Nav */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="hidden md:flex gap-8"
          >
            {navItems.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="section-label hover:text-[var(--color-text)] transition-colors"
              >
                {item}
              </a>
            ))}
          </motion.div>

          {/* Language Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              onMouseEnter={() => setIsLangOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-theme rounded-full hover:bg-card-theme transition-all duration-300 group"
            >
              <img 
                src={`https://flagsapi.com/${languages.find(l => l.code === currentLang)?.flag}/flat/64.png`} 
                alt={currentLang}
                className="w-4 h-4 object-cover rounded-sm shadow-sm"
              />
              <span className="font-mono text-[10px] font-bold tracking-widest">{currentLang}</span>
              <ChevronDown size={10} className={`opacity-40 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  onMouseLeave={() => setIsLangOpen(false)}
                  className="absolute top-full right-0 mt-2 py-1.5 bg-[var(--color-bg)] border border-theme shadow-2xl z-[60] min-w-[150px] rounded-lg overflow-hidden backdrop-blur-md"
                >
                      {languages.map((lang) => (
                        <button 
                          key={lang.code}
                          onClick={() => {
                            setCurrentLang(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-card-theme transition-colors group relative ${currentLang === lang.code ? 'bg-card-theme/30' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={`https://flagsapi.com/${lang.flag}/flat/64.png`} 
                              alt={lang.label}
                              className={`w-4 h-4 object-cover rounded-sm transition-transform duration-300 ${currentLang === lang.code ? 'scale-110' : 'opacity-60 group-hover:opacity-100'}`}
                            />
                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${currentLang === lang.code ? 'translate-x-1 text-[var(--color-text)]' : 'opacity-40 group-hover:opacity-100'}`}>
                              {lang.label}
                            </span>
                          </div>
                          {currentLang === lang.code && (
                            <motion.div 
                              layoutId="active-lang-indicator"
                              className="relative"
                            >
                              <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.2, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[var(--color-text)] rounded-full blur-[2px]"
                              />
                              <div className="w-1 h-1 rounded-full bg-[var(--color-text)]" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={() => {
              if (theme === 'light') setTheme('evening');
              else if (theme === 'evening') setTheme('dark');
              else setTheme('light');
            }}
            className="p-2 hover:opacity-50 transition-opacity z-50 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === 'light' && <SunIcon />}
            {theme === 'evening' && <EveningIcon />}
            {theme === 'dark' && <MoonIcon />}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:opacity-50 transition-opacity z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[var(--color-bg)] flex flex-col items-center justify-center gap-8 pt-24 md:hidden z-[45]"
          >
            {navItems.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-light tracking-tight hover:opacity-50 transition-opacity"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-6 md:px-12 pt-48 max-w-7xl mx-auto">
        {/* Intro / Hero */}
        <section id="about" className="min-h-[80vh] flex flex-col">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-col gap-12"
          >
            <motion.h1 
              variants={fadeInUp}
              className="display-title"
            >
              ALEX<br />CARTER
            </motion.h1>
            
            <motion.div 
              variants={fadeInUp}
              className="max-w-xl flex flex-col gap-6"
            >
              <h2 className="section-label">Who am I</h2>
              <p className="text-xl md:text-2xl font-light leading-relaxed opacity-80">
                Independent Developer and Product Designer specializing in building minimalist, 
                high-performance web interfaces that prioritize clarity and user intent.
              </p>
              <p className="text-lg font-normal opacity-60">
                Currently exploring the intersection of Generative AI and Human-Computer Interaction.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Detailed About Section */}
        <section className="mb-32 md:mb-48 border-t border-theme pt-8 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-label mb-12">About / Profile</h2>
            <div className="w-full h-[1px] bg-theme mb-12 md:mb-24 opacity-20" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left Column */}
              <div className="flex flex-col justify-between gap-12 lg:gap-24">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight max-w-2xl">
                  Over the years, I have worked on customer-facing products with a strong focus on excellent user experience and accessibility
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 text-sm">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Product Development</p>
                    <p className="font-medium">UX/UI & Design</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="opacity-40">Say hello</p>
                    <a href="mailto:hello@alexcarter.dev" className="border-b border-[var(--color-text)] pb-0.5 hover:opacity-50 transition-opacity self-start">
                      hello@alexcarter.dev
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href="#" className="border-b border-[var(--color-text)] pb-0.5 hover:opacity-50 transition-opacity flex items-center gap-1 self-start">
                      Explore LinkedIn <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6 md:gap-8 text-lg md:text-xl opacity-80 font-light leading-relaxed">
                <p>
                  Self-taught software engineer with a strong knowledge of TypeScript, Swift, and Java. I am passionate about working on meaningful projects that have a positive impact on people's lives.
                </p>
                <p>
                  I have hands-on experience working on high-traffic, customer-facing products and prioritize building clean, maintainable codebases that enable continuous improvement and scalability.
                </p>
                <p>
                  I hold a Bachelor of Business Administration from Hult International Business School in London and an International Baccalaureate from Leysin American School in Switzerland.
                </p>
                <p>
                  I am fluent in English and Russian and have experience working and studying in an international environment.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Experience */}
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
                  {/* Company Name */}
                  <h3 className="text-5xl md:text-8xl font-medium tracking-tight">
                    {job.company}
                  </h3>
                  
                  {/* content grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32">
                    {/* Left Side: Tagline, Period & Description */}
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

                    {/* Right Side: Metadata Table */}
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

        {/* Projects */}
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
                  onClick={() => setSelectedProject(project)}
                  className="flex flex-col gap-6 cursor-pointer group"
                >
                  <div className="aspect-[4/3] bg-card-theme flex items-center justify-center border border-theme">
                    <span className="font-mono text-[10px] opacity-20 uppercase tracking-[0.2em]">Preview / {project.title}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {project.title}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="opacity-60 leading-relaxed max-w-sm text-sm">
                        {project.desc}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] opacity-40">{project.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" className="mb-48 border-t border-theme pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-24"
          >
            <div className="flex flex-col gap-6">
              <h2 className="section-label">Expertise & Capabilities</h2>
              <h3 className="text-4xl md:text-6xl font-medium tracking-tight max-w-3xl leading-[1.1]">
                Specialized in the intersection of design precision and engineering excellence.
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex flex-col gap-8 group">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] opacity-40 uppercase tracking-[0.2em]">0{i + 1} /</span>
                    <h4 className="text-2xl font-medium">{cap.category}</h4>
                  </div>
                  
                  <p className="opacity-60 leading-relaxed font-light">
                    {cap.desc}
                  </p>
                  
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
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact */}
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
      </main>

      <footer className="px-6 md:px-12 py-12 border-t border-theme max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center transition-colors duration-300">
        <p className="font-mono text-[10px] opacity-40">DESIGNED & BUILT BY ALEX CARTER</p>
        <p className="font-mono text-[10px] opacity-40 mt-4 md:mt-0">LAST UPDATED / APR 2024</p>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && !isMenuOpen && !selectedProject && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] p-4 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full shadow-xl transition-shadow duration-200"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

