import { useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'radio-theme';

/**
 * Custom hook for managing dark/light theme with LocalStorage persistence
 * @returns {{ theme: string, toggleTheme: () => void, setTheme: (theme: string) => void }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    // Initialize theme from localStorage or system preference
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Update data-theme attribute on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme, setTheme };
}
