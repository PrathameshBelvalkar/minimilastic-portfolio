/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { BackToTopButton } from './components/BackToTopButton';
import { Footer } from './components/Footer';
import { MobileMenu } from './components/MobileMenu';
import { Navbar } from './components/Navbar';
import { ProjectModal, type Project } from './components/ProjectModal';
import { AboutProfileSection } from './components/sections/AboutProfileSection';
import { CapabilitiesSection } from './components/sections/CapabilitiesSection';
import { ContactSection } from './components/sections/ContactSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';

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
      <ProjectModal selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />

      <Navbar
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        navItems={navItems}
        theme={theme}
        onToggleTheme={() => {
          if (theme === 'light') setTheme('evening');
          else if (theme === 'evening') setTheme('dark');
          else setTheme('light');
        }}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isLangOpen={isLangOpen}
        setIsLangOpen={setIsLangOpen}
        languages={languages}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      <MobileMenu isMenuOpen={isMenuOpen} navItems={navItems} onNavigate={() => setIsMenuOpen(false)} />

      <main className="px-6 md:px-12 pt-48 max-w-7xl mx-auto">
        <HeroSection />
        <AboutProfileSection />
        <ExperienceSection experience={experience} />
        <ProjectsSection projects={projects} onSelectProject={(p) => setSelectedProject(p)} />
        <CapabilitiesSection capabilities={capabilities} />
        <ContactSection />
      </main>

      <Footer />

      <BackToTopButton
        show={showBackToTop}
        disabled={isMenuOpen || !!selectedProject}
        onClick={scrollToTop}
      />
    </div>
  );
}

