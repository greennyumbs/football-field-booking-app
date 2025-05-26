import React, { useState, useEffect, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { fieldsAPI } from '../services/api';
import TimeTable from './TimeTable';
import BookingModal from './BookingModal';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useTranslation } from 'react-i18next';

interface Field {
  id: number;
  name: string;
  description: string;
  pricePerHour: number;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');  const [selectedDuration, setSelectedDuration] = useState(1);  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [collapsedFields, setCollapsedFields] = useState<Set<number>>(new Set());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchFields();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMobileMenu]);

  const fetchFields = async () => {
    try {
      const response = await fieldsAPI.getAll();
      setFields(response.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotClick = (field: Field, startTime: string, duration: number) => {
    setSelectedField(field);
    setSelectedStartTime(startTime);
    setSelectedDuration(duration);
    setShowBookingModal(true);
  };
  const handleBookingSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  const toggleFieldCollapse = (fieldId: number) => {
    setCollapsedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  const toggleAllFields = () => {
    if (collapsedFields.size === fields.length) {
      // All are collapsed, expand all
      setCollapsedFields(new Set());
    } else {
      // Some or none are collapsed, collapse all
      setCollapsedFields(new Set(fields.map(field => field.id)));
    }
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      dates.push(date);
    }
    return dates;
  };
  const formatDateTab = (date: Date) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return t('common.today');
    } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
      return t('common.tomorrow');
    } else {
      return format(date, 'EEE, MMM d');
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">{t('dashboard.loading_fields')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-secondary-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white text-xl">⚽</span>
              </div>            <div>
                <h1 className="text-xl lg:text-2xl font-bold text-secondary-800">{t('dashboard.football_fields')}</h1>
                <p className="text-sm lg:text-base text-secondary-600">{t('dashboard.welcome_back', { name: user?.name })}</p>
              </div>
            </div>            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <button
                onClick={logout}
                className="bg-error-500 hover:bg-error-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                {t('dashboard.sign_out')}
              </button>
            </div>{/* Mobile Hamburger Menu */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
                aria-label="Menu"
              >
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Mobile Menu Dropdown */}
              {showMobileMenu && (                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{t('common.theme')}</span>
                      <ThemeSwitcher />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{t('common.language')}</span>
                      <LanguageSwitcher />
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <button
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full bg-error-500 hover:bg-error-600 text-white font-semibold px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {t('dashboard.sign_out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>      {/* Date Selector */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-secondary-200/50 sticky top-[73px] lg:top-[89px] z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center space-x-4 mb-3">
            <h2 className="text-lg font-semibold text-secondary-800">{t('dashboard.select_date')}</h2>
            <div className="text-sm text-secondary-500">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
          <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
            {generateDateOptions().map((date) => (
              <button
                key={format(date, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ease-out
                  ${format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    ? 'bg-primary-600 text-white shadow-soft transform scale-105'
                    : 'bg-white text-secondary-700 hover:bg-primary-50 hover:text-primary-700 shadow-sm'
                  }
                `}
              >
                {formatDateTab(date)}
              </button>
            ))}
          </div>
        </div>
      </div>      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">        {/* Control Bar */}
        {fields.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-secondary-800">{t('dashboard.available_fields')}</h2>
              <span className="text-sm text-secondary-500">({fields.length} {fields.length === 1 ? t('dashboard.field_count_one') : t('dashboard.field_count_other')})</span>
            </div>
            <button
              onClick={toggleAllFields}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {collapsedFields.size === fields.length ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                )}
              </svg>
              <span>{collapsedFields.size === fields.length ? t('dashboard.expand_all') : t('dashboard.collapse_all')}</span>
            </button>
          </div>
        )}

        {/* Desktop Grid Layout */}
        <div className="hidden lg:block space-y-6">
          {fields.map((field) => {
            const isCollapsed = collapsedFields.has(field.id);
            return (
              <div key={`${field.id}-${refreshTrigger}`} className="card-interactive overflow-hidden">
                {/* Field Header */}
                <div className="p-6 border-b border-secondary-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                        <span className="text-white text-xl">⚽</span>
                      </div>                      <div>
                        <h3 className="text-xl font-bold text-secondary-800">{field.name}</h3>
                        <p className="text-secondary-600 text-sm">{field.description || t('dashboard.premium_field')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-primary-600 font-semibold text-lg">{t('dashboard.price_per_hour', { price: field.pricePerHour })}</span>
                      <button
                        onClick={() => toggleFieldCollapse(field.id)}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                        aria-label={isCollapsed ? t('dashboard.expand_field') : t('dashboard.collapse_field')}
                      >
                        <svg 
                          className={`w-5 h-5 text-secondary-600 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                  {/* Field Content - Collapsible */}
                <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-none opacity-100'}`}>
                  <div className="p-6" style={{ overflow: 'visible' }}>
                    <TimeTable
                      fieldId={field.id}
                      fieldName={field.name}
                      selectedDate={selectedDate}
                      onTimeSlotClick={(startTime, duration) => 
                        handleTimeSlotClick(field, startTime, duration)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {fields.map((field) => {
            const isCollapsed = collapsedFields.has(field.id);
            return (
              <div key={`${field.id}-${refreshTrigger}`} className="card overflow-hidden animate-slide-up">
                {/* Field Header */}
                <div className="p-4 border-b border-secondary-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-primary-600 rounded-lg flex items-center justify-center shadow-soft">
                        <span className="text-white text-lg">⚽</span>
                      </div>                      <div>
                        <h3 className="text-lg font-bold text-secondary-800">{field.name}</h3>
                        <p className="text-secondary-600 text-xs">{field.description || t('dashboard.premium_field')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-primary-600 font-semibold">{t('dashboard.price_per_hour', { price: field.pricePerHour })}</span>
                      <button
                        onClick={() => toggleFieldCollapse(field.id)}
                        className="p-1.5 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                        aria-label={isCollapsed ? t('dashboard.expand_field') : t('dashboard.collapse_field')}
                      >
                        <svg 
                          className={`w-4 h-4 text-secondary-600 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Field Content - Collapsible */}
                <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-none opacity-100'} overflow-hidden`}>
                  <div className="p-4">
                    <TimeTable
                      fieldId={field.id}
                      fieldName={field.name}
                      selectedDate={selectedDate}
                      onTimeSlotClick={(startTime, duration) => 
                        handleTimeSlotClick(field, startTime, duration)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏟️</span>
            </div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">{t('dashboard.no_fields_available')}</h3>
            <p className="text-secondary-600">{t('dashboard.check_back_later')}</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedField && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          field={selectedField}
          selectedDate={selectedDate}
          initialStartTime={selectedStartTime}
          initialDuration={selectedDuration}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
