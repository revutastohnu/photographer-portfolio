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
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // Завантажуємо слоти для обраної дати
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/availability?days=21');
        const data = await response.json();
        
        console.log('All slots from API:', data.slots?.length || 0);
        
        if (data.slots) {
          // Фільтруємо слоти для обраної дати (з урахуванням timezone)
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
          const day = String(selectedDate.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          console.log('Looking for date:', dateStr);
          
          const slotsForDate = data.slots.filter((slot: TimeSlot) => {
            // Конвертуємо UTC в локальний час для порівняння
            const slotDate = new Date(slot.startISO);
            const slotDateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')}`;
            return slotDateStr === dateStr;
          });
          
          console.log('Slots for', dateStr, ':', slotsForDate.length);
          console.log('Sample slots:', slotsForDate.slice(0, 3));
          
          setAvailableSlots(slotsForDate);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const isDateAvailable = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Завтра
    tomorrow.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate >= tomorrow; // Доступно тільки з завтра
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
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

  return (
    <div className="space-y-8">
      {/* Календар */}
      <div className="space-y-6">
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
            const selected = isDateSelected(date);

            return (
              <motion.button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={!available}
                className={`
                  aspect-square rounded-xl text-sm font-light transition-all duration-300
                  ${available ? 'hover:bg-foreground/10 cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                  ${selected ? 'bg-foreground text-background' : 'bg-transparent'}
                `}
                whileHover={available ? { scale: 1.05 } : {}}
                whileTap={available ? { scale: 0.95 } : {}}
              >
                {date.getDate()}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Доступні слоти */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-t border-foreground/10 pt-6">
            <h3 className="text-xl font-light">
              Вільний час на {selectedDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
            </h3>
            {isLoading && (
              <span className="text-sm text-foreground/60">Завантаження...</span>
            )}
          </div>

          {!isLoading && availableSlots.length === 0 && (
            <p className="text-foreground/60 text-center py-8">
              На цей день немає вільних слотів. Оберіть іншу дату.
            </p>
          )}

          {!isLoading && availableSlots.length > 0 && (
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
                        ? 'bg-foreground text-background' 
                        : 'bg-foreground/5 hover:bg-foreground/10 border border-foreground/10'
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
