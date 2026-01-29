'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TimeSlot } from '@/lib/types';

interface AvailabilityPickerProps {
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot: TimeSlot | null;
}

export default function AvailabilityPicker({
  onSlotSelect,
  selectedSlot,
}: AvailabilityPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/availability?days=21');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch availability');
      }

      setSlots(data.slots);
    } catch (err: any) {
      console.error('Error fetching availability:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Групуємо слоти по датах
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = new Date(slot.startISO);
    const dateKey = date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        displayDate: date.toLocaleDateString('uk-UA', {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
        }),
        slots: [],
      };
    }
    acc[dateKey].slots.push(slot);
    return acc;
  }, {} as Record<string, { displayDate: string; slots: TimeSlot[] }>);

  const availableDates = Object.keys(slotsByDate).sort();

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="mt-4 text-sm text-foreground/60">Завантаження вільних слотів...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 space-y-4">
        <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10">
          <p className="text-sm text-foreground/60">
            ⚠️ Календар ще не налаштований.
          </p>
          <p className="text-xs text-foreground/40 mt-2">
            Щоб увімкнути real-time доступність, налаштуй Google Calendar API.
            Дивись README для інструкцій.
          </p>
        </div>
        <button
          onClick={() => onSlotSelect({
            startISO: new Date().toISOString(),
            endISO: new Date().toISOString(),
            label: 'Зв\'яжіться зі мною для запису',
          })}
          className="w-full px-6 py-4 rounded-2xl border border-foreground/20 hover:border-foreground/60 transition-colors duration-300 text-sm"
        >
          Продовжити без вибору слоту
        </button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="py-12 text-center text-foreground/60">
        <p>Наразі немає вільних слотів. Спробуйте пізніше.</p>
      </div>
    );
  }

  const selectedDateSlots = selectedDate ? slotsByDate[selectedDate]?.slots || [] : [];

  return (
    <div className="space-y-8">
      {/* Крок 1: Вибір дати */}
      {!selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-medium">Оберіть дату</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableDates.map((dateKey) => {
              const dateInfo = slotsByDate[dateKey];
              const slotsCount = dateInfo.slots.length;

              return (
                <motion.button
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  className="p-4 rounded-xl border border-foreground/20 hover:border-foreground/60 hover:shadow-sm transition-all duration-300 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium">{dateInfo.displayDate}</div>
                  <div className="text-xs text-foreground/60 mt-1">
                    {slotsCount} {slotsCount === 1 ? 'слот' : 'слотів'}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Крок 2: Вибір часу */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => {
                  setSelectedDate(null);
                  onSlotSelect(null as any);
                }}
                className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад до дат
              </button>
              <h3 className="text-lg font-medium mt-2">
                {slotsByDate[selectedDate]?.displayDate}
              </h3>
            </div>
            <div className="text-xs text-foreground/60">
              Робочі години: 9:00 - 15:00
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedDateSlots.map((slot) => {
              const isSelected = selectedSlot?.startISO === slot.startISO;
              const time = new Date(slot.startISO).toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.button
                  key={slot.startISO}
                  onClick={() => onSlotSelect(slot)}
                  className={`px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                    isSelected
                      ? 'bg-foreground text-background shadow-md'
                      : 'border border-foreground/20 hover:border-foreground/60 hover:shadow-sm'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {time}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
