import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
  };

  const isEnglish = i18n.language === 'en';

  return (
    <div className="relative">
      <button
        onClick={toggleLanguage}
        className="relative flex items-center w-16 h-8 bg-secondary-200 rounded-full p-1 transition-all duration-300 ease-in-out hover:bg-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label={`Switch to ${isEnglish ? 'Thai' : 'English'}`}
      >
        {/* Background track */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-red-100"></div>
        
        {/* Toggle circle */}
        <div
          className={`relative z-10 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${
            isEnglish ? 'transform translate-x-0' : 'transform translate-x-8'
          }`}
        >
          {/* Current language indicator */}
          <span className="text-xs font-bold leading-none text-gray-700">
            {isEnglish ? '🇺🇸' : '🇹🇭'}
          </span>
        </div>
        
        {/* Background indicators */}
        <div className="absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold opacity-60 text-gray-600">🇺🇸</span>
        </div>
        <div className="absolute right-1 top-1 w-6 h-6 rounded-full flex items-center justify-center">
          <span className="text-xs opacity-60">🇹🇭</span>
        </div>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
