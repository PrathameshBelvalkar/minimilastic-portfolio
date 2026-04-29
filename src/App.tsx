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
import { portfolioData } from './data';
import i18n, { uiLangToI18nLang } from './i18n';
import { applyProjectSeo } from './seo';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'evening' | 'dark'>('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentLang, setCurrentLang] = useState(() => {
    const stored = localStorage.getItem('lang');
    if (stored && uiLangToI18nLang[stored]) return stored;
    return portfolioData.languages[0]?.code ?? 'EN';
  });
  const [isLangOpen, setIsLangOpen] = useState(false);

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

  useEffect(() => {
    applyProjectSeo(selectedProject);
  }, [selectedProject]);

  useEffect(() => {
    localStorage.setItem('lang', currentLang);
    i18n.changeLanguage(uiLangToI18nLang[currentLang] ?? 'en');
  }, [currentLang]);

  return (
    <div className="min-h-screen hero-pattern pb-32 transition-colors duration-300">
      <ProjectModal selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />

      <Navbar
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        brandName={portfolioData.person.name}
        navItems={portfolioData.navItems}
        theme={theme}
        onToggleTheme={() => {
          if (theme === 'light') setTheme('evening');
          else if (theme === 'evening') setTheme('dark');
          else setTheme('light');
        }}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isLangOpen={isLangOpen}
        setIsLangOpen={setIsLangOpen}
        languages={portfolioData.languages}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      <MobileMenu
        isMenuOpen={isMenuOpen}
        navItems={portfolioData.navItems}
        onNavigate={() => setIsMenuOpen(false)}
      />

      <main className="px-6 md:px-12 pt-48 max-w-7xl mx-auto">
        <HeroSection
          hideScrollHint={isScrolled}
          titleLines={portfolioData.hero.titleLines}
          scrollCtaHref={portfolioData.hero.scrollCtaHref}
        />
        <AboutProfileSection
          email={portfolioData.aboutProfile.email}
          linkedinHref={portfolioData.aboutProfile.linkedinHref}
        />
        <ExperienceSection experience={portfolioData.experience} />
        <ProjectsSection projects={portfolioData.projects} onSelectProject={(p) => setSelectedProject(p)} />
        <CapabilitiesSection capabilities={portfolioData.capabilities} />
        <ContactSection email={portfolioData.contact.email} links={portfolioData.contact.links} />
      </main>

      <Footer {...portfolioData.footer} />

      <BackToTopButton
        show={showBackToTop}
        disabled={isMenuOpen || !!selectedProject}
        onClick={scrollToTop}
      />
    </div>
  );
}

