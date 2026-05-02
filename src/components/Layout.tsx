import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router';
import { BackToTopButton } from './BackToTopButton';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileMenu } from './MobileMenu';
import { Navbar } from './Navbar';
import { portfolioData } from '../data';
import i18n, { uiLangToI18nLang } from '../i18n';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children?: ReactNode;
};

export function Layout({ children }: Props) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    localStorage.setItem('lang', currentLang);
    i18n.changeLanguage(uiLangToI18nLang[currentLang] ?? 'en');
  }, [currentLang]);

  return (
    <div className="min-h-screen hero-pattern transition-colors duration-300 pb-[4.75rem] md:pb-0">
      <Navbar
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        brandName={portfolioData.person.name}
        navItems={portfolioData.navItems}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isLangOpen={isLangOpen}
        setIsLangOpen={setIsLangOpen}
        languages={portfolioData.languages}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        showLanguageSelector={!pathname.startsWith('/blog')}
        showBrandLinkAlways={pathname.startsWith('/blog')}
      />

      <MobileMenu
        isMenuOpen={isMenuOpen}
        navItems={portfolioData.navItems}
        onNavigate={() => setIsMenuOpen(false)}
      />

      {!isMenuOpen ? <MobileBottomNav /> : null}

      {children ?? <Outlet />}

      <Footer {...portfolioData.footer} />

      <BackToTopButton
        show={showBackToTop}
        disabled={isMenuOpen}
        onClick={scrollToTop}
      />
    </div>
  );
}
