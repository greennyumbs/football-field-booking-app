import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { animateThemeChange } from '../utils/themeAnimation';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, systemTheme, isUsingSystemTheme, resetToSystemTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isDark = theme === 'dark';
  
  // Function to handle theme toggle with animation
  const handleThemeToggle = () => {
    // If menu is open, close it
    if (showMenu) {
      setShowMenu(false);
      return;
    }
    
    // Toggle between light and dark
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Run animation
    animateThemeChange();
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMenu]);
  return (
    <div className="relative">
      <button
        onClick={handleThemeToggle}
        className="relative flex items-center w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800 overflow-hidden"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Background track with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 to-blue-700 dark:from-blue-900 dark:to-indigo-950 transition-colors duration-300"></div>
        
        {/* Toggle circle */}
        <div
          className={`relative z-10 w-5 h-5 bg-white dark:bg-secondary-800 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${
            isDark ? 'translate-x-7' : 'translate-x-0'
          }`}
        >
          {/* Icon with animation */}
          <span className="text-xs leading-none transition-opacity duration-300">
            {isDark ? '🌙' : '☀️'}
          </span>
        </div>
        
        {/* Sun icon (visible in light mode) */}
        <div className={`absolute left-1 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-60'}`}>
          <span className="text-xs">☀️</span>
        </div>
        
        {/* Moon icon (visible in dark mode) */}
        <div className={`absolute right-1 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-opacity duration-300 ${isDark ? 'opacity-60' : 'opacity-0'}`}>
          <span className="text-xs">🌙</span>
        </div>
        
        {/* Stars (only visible in dark mode) */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-60' : 'opacity-0'}`}>
          <span className="absolute top-1 right-4 text-[8px] text-white">✦</span>
          <span className="absolute bottom-1 right-3 text-[8px] text-white">✧</span>
        </div>
      </button>
      
      {/* Theme Selection Dropdown */}
      {showMenu && (
        <div 
          ref={menuRef}
          className="absolute right-0 mt-2 w-40 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 py-2 z-50"
        >
          <div className="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 border-b border-secondary-100 dark:border-secondary-700 mb-1">
            Theme
          </div>
          
          <button
            onClick={() => {
              setTheme('light');
              setShowMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
              theme === 'light' && !isUsingSystemTheme 
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">☀️</span>
              Light
            </div>
          </button>
          
          <button
            onClick={() => {
              setTheme('dark');
              setShowMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
              theme === 'dark' && !isUsingSystemTheme 
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">🌙</span>
              Dark
            </div>
          </button>
          
          <button
            onClick={() => {
              resetToSystemTheme();
              setShowMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
              isUsingSystemTheme 
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">💻</span>
              System ({systemTheme})
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
