import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

type Props = {
  show: boolean;
  disabled: boolean;
  onClick: () => void;
};

export function BackToTopButton({ show, disabled, onClick }: Props) {
  return (
    <AnimatePresence>
      {show && !disabled && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={onClick}
          className="fixed bottom-[4.75rem] right-6 z-[60] p-4 bg-[var(--color-text)] text-[var(--color-bg)] rounded-full shadow-xl transition-shadow duration-200 md:bottom-8 md:right-8"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

