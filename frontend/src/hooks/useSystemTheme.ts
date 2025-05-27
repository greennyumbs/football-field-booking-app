import { useState, useEffect } from 'react';

type SystemThemeType = 'dark' | 'light';

/**
 * A hook that detects the user's system theme preference.
 * @returns The system theme preference ('dark' or 'light')
 */
export function useSystemTheme(): SystemThemeType {
  const [systemTheme, setSystemTheme] = useState<SystemThemeType>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default to light theme
  });

  useEffect(() => {
    // Return early if window is not defined
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    // Add listener for theme changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return systemTheme;
}
