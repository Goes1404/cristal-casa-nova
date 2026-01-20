import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-medium flex items-center justify-center overflow-hidden hover:border-primary/30 transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {/* Glassmorphism glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="relative"
          >
            <Moon className="h-5 w-5 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="relative"
          >
            <Sun className="h-5 w-5 text-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
