import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'careguide_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // ignore localStorage errors in sandboxed environments
    }
    return 'light';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let activeIsDark = false;
      if (theme === 'dark') {
        activeIsDark = true;
      } else if (theme === 'light') {
        activeIsDark = false;
      } else {
        activeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(activeIsDark);
      if (activeIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes if theme is 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
