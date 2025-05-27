import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSystemTheme } from '../hooks/useSystemTheme';
import { listenForColorSchemeChanges } from '../utils/colorScheme';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  systemTheme: Theme;
  isUsingSystemTheme: boolean;
  resetToSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useSystemTheme();
  const [isUsingSystemTheme, setIsUsingSystemTheme] = useState(() => {
    return !localStorage.getItem('theme');
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Use system preference if no saved theme
    return systemTheme;
  });

  // Apply the theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Add a transition class for smoother switching
    if (!root.classList.contains('theme-transition')) {
      root.classList.add('theme-transition');
    }
    
    // Save to localStorage only if not using system theme
    if (!isUsingSystemTheme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, isUsingSystemTheme]);

  // Update theme when system theme changes if following system
  useEffect(() => {
    if (isUsingSystemTheme) {
      setThemeState(systemTheme);
    }
  }, [systemTheme, isUsingSystemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    return listenForColorSchemeChanges((isDark) => {
      if (isUsingSystemTheme) {
        setThemeState(isDark ? 'dark' : 'light');
      }
    });
  }, [isUsingSystemTheme]);

  const toggleTheme = () => {
    setIsUsingSystemTheme(false);
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setIsUsingSystemTheme(false);
    setThemeState(newTheme);
  };

  const resetToSystemTheme = () => {
    setIsUsingSystemTheme(true);
    localStorage.removeItem('theme');
    setThemeState(systemTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme, 
      systemTheme,
      isUsingSystemTheme,
      resetToSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
