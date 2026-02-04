'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TimeSlot } from '@/lib/types';

interface BookingCalendarProps {
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot: TimeSlot | null;
}

export default function BookingCalendar({ onSlotSelect, selectedSlot }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSelection, setShowTimeSelection] = useState(false);

  // Генеруємо дні місяця
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Додаємо порожні дні до початку місяця
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    
    // Додаємо дні місяця
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  // Завантажуємо всі слоти при mount
  useEffect(() => {
    const fetchAllSlots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/availability?days=21');
        const data = await response.json();

        if (data.slots) {
          setAllSlots(data.slots);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAllSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSlots();
  }, []);

  // Фільтруємо слоти для обраної дати
  useEffect(() => {
    if (!selectedDate || !allSlots.length) {
      setAvailableSlots([]);
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const slotsForDate = allSlots.filter((slot: TimeSlot) => {
      const slotDate = new Date(slot.startISO);
      const slotDateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')}`;
      return slotDateStr === dateStr;
    });

    setAvailableSlots(slotsForDate);
  }, [selectedDate, allSlots]);

  const isDateAvailable = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Перевірка чи дата не в минулому
    if (checkDate < tomorrow) return false;

    // Перевірка чи є слоти для цієї дати
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const hasSlots = allSlots.some((slot: TimeSlot) => {
      const slotDate = new Date(slot.startISO);
      const slotDateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')}`;
      return slotDateStr === dateStr;
    });

    return hasSlots;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
    setShowTimeSelection(true);
  };

  const handleBackToCalendar = () => {
    setShowTimeSelection(false);
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="mt-4 text-sm text-foreground/60">Завантаження календаря...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Крок 1: Вибір дати */}
      {!showTimeSelection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-medium mb-2">Крок 1: Оберіть дату</h3>
            <p className="text-sm text-foreground/60">Доступні тільки дати з вільними слотами</p>
          </div>

          {/* Заголовок календаря */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-light capitalize">{formatMonthYear(currentMonth)}</h3>
            <div className="flex gap-2">
              <motion.button
                onClick={handlePrevMonth}
                className="w-10 h-10 rounded-full border border-foreground/20 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ←
              </motion.button>
              <motion.button
                onClick={handleNextMonth}
                className="w-10 h-10 rounded-full border border-foreground/20 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                →
              </motion.button>
            </div>
          </div>

          {/* Дні тижня */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm text-foreground/60 font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Дні місяця */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} />;
              }

              const available = isDateAvailable(date);

              return (
                <motion.button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  disabled={!available}
                  className={`
                    aspect-square rounded-xl text-sm font-light transition-all duration-300
                    ${available
                      ? 'hover:bg-foreground/10 cursor-pointer border border-foreground/20 hover:border-foreground/40'
                      : 'opacity-20 cursor-not-allowed'
                    }
                  `}
                  whileHover={available ? { scale: 1.05 } : {}}
                  whileTap={available ? { scale: 0.95 } : {}}
                >
                  {date.getDate()}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Крок 2: Вибір часу */}
      {showTimeSelection && selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <button
              onClick={handleBackToCalendar}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-300 flex items-center gap-2 mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад до календаря
            </button>
            <h3 className="text-xl font-medium">Крок 2: Оберіть час</h3>
            <p className="text-foreground/60 mt-1">
              {selectedDate.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          {availableSlots.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">
              На цей день немає вільних слотів. Оберіть іншу дату.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot?.startISO === slot.startISO;
                const time = new Date(slot.startISO).toLocaleTimeString('uk-UA', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <motion.button
                    key={slot.startISO}
                    onClick={() => onSlotSelect(slot)}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-light transition-all duration-300
                      ${isSelected
                        ? 'bg-foreground text-background shadow-md'
                        : 'bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-foreground/20'
                      }
                    `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {time}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
