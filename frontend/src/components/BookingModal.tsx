import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { bookingsAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

interface Field {
  id: number;
  name: string;
  pricePerHour: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
  selectedDate: Date;
  initialStartTime: string;
  initialDuration: number;
  onBookingSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  field,
  selectedDate,
  initialStartTime,
  initialDuration,
  onBookingSuccess,
}) => {  const [startTime, setStartTime] = useState(initialStartTime);
  const [duration, setDuration] = useState(initialDuration);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setStartTime(initialStartTime);
      setDuration(initialDuration);
      setNotes('');
      setError('');
    }
  }, [isOpen, initialStartTime, initialDuration]);

  const calculateEndTime = (start: string, dur: number) => {
    const [hour, minute] = start.split(':').map(Number);
    const endHour = hour + dur;
    return `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const calculateTotalPrice = () => {
    return field.pricePerHour * duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await bookingsAPI.create({
        fieldId: field.id,
        bookingDate: format(selectedDate, 'yyyy-MM-dd'),
        startTime,
        duration,
        notes,
      });
      
      onBookingSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('booking.booking_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 23; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      const displayStr = `${hour <= 12 ? hour : hour - 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      options.push({ value: timeStr, label: displayStr });
    }
    return options;
  };
  const generateDurationOptions = () => {
    const options = [];
    for (let i = 1; i <= 8; i++) {
      options.push({ value: i, label: `${i} ${i > 1 ? t('common.hours') : t('common.hour')}` });
    }
    return options;
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-soft-lg max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 lg:p-8">          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-800 dark:text-gray-100">{t('booking.book_your_field')}</h2>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-secondary-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>          <div className="mb-6">
            <div className="bg-gradient-to-r from-primary-50 to-success-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl border border-primary-200 dark:border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">⚽</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-secondary-800 dark:text-gray-100">{field.name}</h3>
                  <p className="text-primary-700 dark:text-gray-300 text-sm font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-success-600 dark:text-green-400 text-sm font-semibold">{t('dashboard.price_per_hour', { price: field.pricePerHour })}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-300 mb-3">
                  {t('booking.start_time')}
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-primary"
                  required
                >
                  {generateTimeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>              <div>
                <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-300 mb-3">
                  {t('booking.duration')}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input-primary"
                  required
                >
                  {generateDurationOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-secondary-50 dark:bg-gray-700 p-6 rounded-2xl border border-secondary-200 dark:border-gray-600">
              <div className="space-y-3">                <div className="flex justify-between items-center">
                  <span className="text-secondary-700 dark:text-gray-300 font-medium">{t('booking.end_time')}:</span>
                  <span className="font-bold text-secondary-800 dark:text-gray-100 text-lg">{calculateEndTime(startTime, duration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-700 dark:text-gray-300 font-medium">{t('booking.duration')}:</span>
                  <span className="font-semibold text-primary-600 dark:text-blue-400">{duration} {duration > 1 ? t('common.hours') : t('common.hour')}</span>
                </div>
                <div className="border-t border-secondary-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-secondary-800 dark:text-gray-100">{t('booking.total_price')}:</span>
                    <span className="font-bold text-2xl text-success-600 dark:text-green-400">{t('booking.total_amount', { amount: calculateTotalPrice() })}</span>
                  </div>
                </div>
              </div>
            </div>            <div>
              <label className="block text-sm font-semibold text-secondary-700 dark:text-gray-300 mb-3">
                {t('booking.notes')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="input-primary resize-none"
                placeholder={t('booking.notes_placeholder')}
              />
            </div>            {error && (
              <div className="bg-error-50 dark:bg-red-900/30 border border-error-200 dark:border-red-800 text-error-700 dark:text-red-300 px-6 py-4 rounded-xl text-sm animate-slide-up">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-secondary-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 py-4"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 py-4 relative overflow-hidden"
              >
                <span className={`transition-transform duration-200 ${isLoading ? 'translate-y-5 opacity-0' : 'translate-y-0 opacity-100'}`}>
                  {t('booking.confirm_booking_with_price', { amount: calculateTotalPrice() })}
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
