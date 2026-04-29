import { AnimatePresence, motion } from 'motion/react';

type Props = {
  isMenuOpen: boolean;
  navItems: string[];
  onNavigate: () => void;
};

export function MobileMenu({ isMenuOpen, navItems, onNavigate }: Props) {
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-[var(--color-bg)] flex flex-col items-center justify-center gap-8 pt-8 md:hidden z-[45]"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={onNavigate}
              className="text-4xl font-light tracking-tight hover:opacity-50 transition-opacity"
            >
              {item}
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

