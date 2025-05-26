import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-14 h-7 bg-secondary-200 dark:bg-secondary-700 rounded-full p-1 transition-all duration-300 ease-in-out hover:bg-secondary-300 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background track with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-100 to-blue-900"></div>
      
      {/* Toggle circle */}
      <div
        className={`relative z-10 w-5 h-5 bg-white dark:bg-secondary-800 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${
          isDark ? 'transform translate-x-7' : 'transform translate-x-0'
        }`}
      >
        {/* Icon */}
        <span className="text-xs leading-none">
          {isDark ? '🌙' : '☀️'}
        </span>
      </div>
      
      {/* Background icons */}
      <div className="absolute left-1 top-1 w-5 h-5 rounded-full flex items-center justify-center">
        <span className="text-xs opacity-60">☀️</span>
      </div>
      <div className="absolute right-1 top-1 w-5 h-5 rounded-full flex items-center justify-center">
        <span className="text-xs opacity-60">🌙</span>
      </div>
    </button>
  );
};

export default ThemeSwitcher;
