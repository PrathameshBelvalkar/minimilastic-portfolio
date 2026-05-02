import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router';
import { EveningIcon, MoonIcon, SunIcon } from './ThemeIcons';
import { useTranslation } from 'react-i18next';

type Language = { code: string; flag: string; label: string };

type Props = {
  isScrolled: boolean;
  isMenuOpen: boolean;
  brandName: string;
  navItems: string[];
  theme: 'light' | 'evening' | 'dark';
  onToggleTheme: () => void;
  onToggleMenu: () => void;
  isLangOpen: boolean;
  setIsLangOpen: (next: boolean) => void;
  languages: Language[];
  currentLang: string;
  setCurrentLang: (code: string) => void;
};

export function Navbar({
  isScrolled,
  isMenuOpen,
  brandName,
  navItems,
  theme,
  onToggleTheme,
  onToggleMenu,
  isLangOpen,
  setIsLangOpen,
  languages,
  currentLang,
  setCurrentLang
}: Props) {
  const { t } = useTranslation();

  const navKeyByItem: Record<string, string> = {
    About: 'nav.about',
    Capabilities: 'nav.capabilities',
    Experience: 'nav.experience',
    Projects: 'nav.projects',
    Contact: 'nav.contact',
    Blog: 'nav.blog',
  };

  const pageNavItems = new Set(['Blog']);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-500 ${
        isScrolled && !isMenuOpen
          ? 'bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-theme shadow-sm py-4'
          : 'bg-transparent py-8'
      }`}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-50 min-w-[120px]">
        <AnimatePresence mode="wait">
          {isScrolled ? (
            <motion.a
              key="name"
              href="#home"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="font-bold text-xs uppercase tracking-widest hover:opacity-50 transition-all block"
            >
              {brandName}
            </motion.a>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center gap-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:flex gap-8">
          {navItems.map((item) =>
            pageNavItems.has(item) ? (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="section-label hover:text-[var(--color-text)] transition-colors"
              >
                {t(navKeyByItem[item] ?? item)}
              </Link>
            ) : (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="section-label hover:text-[var(--color-text)] transition-colors"
              >
                {t(navKeyByItem[item] ?? item)}
              </a>
            )
          )}
        </motion.div>

        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            onMouseEnter={() => setIsLangOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-theme rounded-full hover:bg-card-theme transition-all duration-300 group"
          >
            <img
              src={`https://flagsapi.com/${languages.find((l) => l.code === currentLang)?.flag}/flat/64.png`}
              alt={currentLang}
              className="w-4 h-4 object-cover rounded-sm"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <span className="font-mono text-[10px] font-bold tracking-widest">{currentLang}</span>
            <ChevronDown
              size={10}
              className={`opacity-40 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}
            />
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
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-card-theme transition-colors group relative ${
                      currentLang === lang.code ? 'bg-card-theme/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://flagsapi.com/${lang.flag}/flat/64.png`}
                        alt={lang.label}
                        className={`w-4 h-4 object-cover rounded-sm transition-transform duration-300 ${
                          currentLang === lang.code ? 'scale-110' : 'opacity-60 group-hover:opacity-100'
                        }`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          currentLang === lang.code
                            ? 'translate-x-1 text-[var(--color-text)]'
                            : 'opacity-40 group-hover:opacity-100'
                        }`}
                      >
                        {lang.label}
                      </span>
                    </div>
                    {currentLang === lang.code && (
                      <motion.div layoutId="active-lang-indicator" className="relative">
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.2, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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

        <button
          onClick={onToggleTheme}
          className="p-2 hover:opacity-50 transition-opacity z-50 flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {theme === 'light' && <SunIcon />}
          {theme === 'evening' && <EveningIcon />}
          {theme === 'dark' && <MoonIcon />}
        </button>

        <button
          onClick={onToggleMenu}
          className="md:hidden p-2 hover:opacity-50 transition-opacity z-50"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}

