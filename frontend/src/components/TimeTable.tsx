import React, { useState, useEffect, useCallback } from 'react';
import { format, isSameDay } from 'date-fns';
import { bookingsAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  duration: number;
  user: {
    name: string;
  };
  status: string;
}

interface TimeTableProps {
  fieldId: number;
  fieldName: string;
  selectedDate: Date;
  onTimeSlotClick: (startTime: string, duration: number) => void;
}

const TimeTable: React.FC<TimeTableProps> = ({ 
  fieldId, 
  fieldName, 
  selectedDate, 
  onTimeSlotClick 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Generate time slots from 6 AM to 11 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        display: `${hour <= 12 ? hour : hour - 12}:00 ${hour < 12 ? 'AM' : 'PM'}`,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await bookingsAPI.getByField(fieldId, dateStr);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [fieldId, selectedDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const isTimeSlotBooked = (time: string) => {
    return bookings.some(booking => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      return time >= bookingStart && time < bookingEnd;
    });
  };

  const getBookingForTime = (time: string) => {
    return bookings.find(booking => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      return time >= bookingStart && time < bookingEnd;
    });
  };

  const isSlotStartTime = (time: string) => {
    return bookings.some(booking => booking.startTime === time);
  };  const formatTimeRange = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      const displayHour = hour <= 12 ? hour : hour - 12;
      const period = hour < 12 ? 'AM' : 'PM';
      return `${displayHour === 0 ? 12 : displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    // For end time, subtract 1 minute to show until 11:59 instead of 12:00
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let adjustedEndHour = endHour;
    let adjustedEndMinute = endMinute - 1;
    
    if (adjustedEndMinute < 0) {
      adjustedEndMinute = 59;
      adjustedEndHour = endHour - 1;
    }
    
    const adjustedEndTime = `${adjustedEndHour.toString().padStart(2, '0')}:${adjustedEndMinute.toString().padStart(2, '0')}`;
    
    return `${formatTime(startTime)} - ${formatTime(adjustedEndTime)}`;
  };

  const getSlotDuration = (time: string) => {
    const booking = bookings.find(booking => booking.startTime === time);
    return booking ? booking.duration : 1;
  };

  const isPastTime = (time: string) => {
    if (!isSameDay(selectedDate, new Date())) {
      return false;
    }
    const now = new Date();
    const [hour] = time.split(':').map(Number);
    return hour < now.getHours();
  };

  const handleSlotClick = (time: string) => {
    if (isTimeSlotBooked(time) || isPastTime(time)) return;
    
    // Default to 1 hour, but user can change in modal
    onTimeSlotClick(time, 1);
  };  return (
    <div className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl shadow-soft border border-secondary-200/50 dark:border-secondary-700/50">
      {/* Header - Only show on mobile, desktop uses parent card header */}
      <div className="lg:hidden p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h3 className="text-lg font-bold">{fieldName}</h3>
        <p className="text-primary-100 text-sm">{format(selectedDate, 'EEEE, MMMM d')}</p>
      </div>
      
      <div className="p-4 lg:p-6" style={{ overflow: 'visible' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-3 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mb-4"></div>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm">{t('booking.loading_schedule')}</p>
          </div>
        ) : (
          <>{/* Desktop Grid Layout - Optimized for larger screens */}
            <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 max-w-full"
                 style={{ overflow: 'visible' }}>
              {timeSlots.map((slot, index) => {
                const isBooked = isTimeSlotBooked(slot.time);
                const booking = getBookingForTime(slot.time);
                const isStartTime = isSlotStartTime(slot.time);
                const isPast = isPastTime(slot.time);
                const slotDuration = getSlotDuration(slot.time);
                
                // Skip rendering if this is a continuation of a multi-hour booking
                if (isBooked && !isStartTime) {
                  return null;
                }

                return (                  <div
                    key={slot.time}
                    onClick={() => handleSlotClick(slot.time)}
                    className={`
                      relative p-3 lg:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 hover:z-50 min-w-0
                      ${isBooked 
                        ? 'bg-error-50 dark:bg-error-900/30 border-error-200 dark:border-error-800/50 cursor-not-allowed hover:scale-100' 
                        : isPast
                        ? 'bg-secondary-100 dark:bg-secondary-800/50 border-secondary-200 dark:border-secondary-700/50 cursor-not-allowed text-secondary-500 dark:text-secondary-400 hover:scale-100'
                        : 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800/50 hover:bg-success-100 dark:hover:bg-success-900/30 hover:border-success-300 dark:hover:border-success-700 hover:shadow-lg hover:shadow-success-200/50 dark:hover:shadow-success-900/30'
                      }
                    `}
                  >
                    <div className="text-center min-w-0">
                      {isBooked && booking ? (
                        <>
                          <div className="text-xs font-semibold text-error-600 dark:text-error-400 mb-1">{t('common.booked')}</div>
                          <div className="text-sm font-bold text-error-700 dark:text-error-300 truncate">
                            {formatTimeRange(booking.startTime, booking.endTime)}
                          </div>
                          <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1 truncate">{booking.user.name}</div>
                          {slotDuration > 1 && (
                            <div className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">{slotDuration}h</div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="text-base lg:text-lg font-bold text-secondary-800 dark:text-secondary-200">{slot.display}</div>                          {isPast ? (
                            <div className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">{t('common.past')}</div>
                          ) : (
                            <div className="text-xs text-success-600 dark:text-success-400 mt-1 font-medium">{t('common.available')}</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>            {/* Mobile List Layout */}
            <div className="lg:hidden space-y-2">
              {timeSlots.map((slot, index) => {
                const isBooked = isTimeSlotBooked(slot.time);
                const booking = getBookingForTime(slot.time);
                const isStartTime = isSlotStartTime(slot.time);
                const isPast = isPastTime(slot.time);
                const slotDuration = getSlotDuration(slot.time);
                
                // Skip rendering if this is a continuation of a multi-hour booking
                if (isBooked && !isStartTime) {
                  return null;
                }

                return (
                  <div
                    key={slot.time}
                    onClick={() => handleSlotClick(slot.time)}
                    className={`
                      p-4 rounded-xl border transition-all duration-200 ease-out
                      ${isBooked 
                        ? 'bg-error-50 dark:bg-error-900/30 border-error-200 dark:border-error-800/50 cursor-not-allowed' 
                        : isPast
                        ? 'bg-secondary-100 dark:bg-secondary-800/50 border-secondary-200 dark:border-secondary-700/50 cursor-not-allowed'
                        : 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800/50 hover:bg-success-100 dark:hover:bg-success-900/30 hover:border-success-300 dark:hover:border-success-700 cursor-pointer active:scale-95'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        {isBooked && booking ? (
                          <>
                            <div className="font-bold text-error-700 dark:text-error-400 text-base">
                              {formatTimeRange(booking.startTime, booking.endTime)}
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400 truncate">{booking.user.name}</div>                            {slotDuration > 1 && (
                              <div className="text-xs text-secondary-500 dark:text-secondary-500">{slotDuration} {slotDuration > 1 ? t('common.hours') : t('common.hour')}</div>
                            )}
                          </>
                        ) : (
                          <div className="font-bold text-secondary-800 dark:text-secondary-200 text-base">{slot.display}</div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0">                        {isBooked ? (
                          <div className="px-3 py-1 bg-error-200 dark:bg-error-800/70 text-error-700 dark:text-error-300 rounded-full text-xs font-semibold">
                            {t('common.booked')}
                          </div>
                        ) : isPast ? (
                          <div className="px-3 py-1 bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 rounded-full text-xs">
                            {t('common.past')}
                          </div>
                        ) : (
                          <div className="px-3 py-1 bg-success-200 dark:bg-success-800/70 text-success-700 dark:text-success-300 rounded-full text-xs font-semibold">
                            {t('common.available')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {timeSlots.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <p className="text-secondary-600 dark:text-secondary-400">{t('booking.no_time_slots')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TimeTable;
