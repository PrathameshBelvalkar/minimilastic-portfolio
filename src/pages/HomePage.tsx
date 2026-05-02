import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ProjectModal, type Project } from '../components/ProjectModal';
import { AboutProfileSection } from '../components/sections/AboutProfileSection';
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection';
import { ContactSection } from '../components/sections/ContactSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { HeroSection } from '../components/sections/HeroSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { blogPosts } from '../blog';
import { portfolioData } from '../data';
import { applyProjectSeo } from '../seo';

export default function HomePage() {
  const { hash } = useLocation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  useEffect(() => {
    applyProjectSeo(selectedProject);
  }, [selectedProject]);

  useEffect(() => {
    const id = hash.replace(/^#/, '');
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [hash]);

  return (
    <>
      <ProjectModal selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />

      <main className="px-6 md:px-12 pt-30 max-w-7xl mx-auto">
        <HeroSection
          hideScrollHint={isScrolled}
          titleLines={portfolioData.hero.titleLines}
          scrollCtaHref={portfolioData.hero.scrollCtaHref}
          trendingPosts={blogPosts.slice(0, 5)}
        />
        <AboutProfileSection
          email={portfolioData.aboutProfile.email}
          linkedinHref={portfolioData.aboutProfile.linkedinHref}
        />
        <ExperienceSection experience={portfolioData.experience} />
        <ProjectsSection
          projects={portfolioData.projects}
          onSelectProject={(p) => setSelectedProject(p)}
        />
        <CapabilitiesSection capabilities={portfolioData.capabilities} />
        <ContactSection email={portfolioData.contact.email} links={portfolioData.contact.links} />
      </main>
    </>
  );
}
