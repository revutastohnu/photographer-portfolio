'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { generateCalendarUrl } from '@/lib/calendar-utils';

// Вимикаємо static generation для цієї сторінки
export const dynamic = 'force-dynamic';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Отримуємо дані з sessionStorage (якщо є)
    const bookingData = sessionStorage.getItem('lastBooking');
    if (bookingData) {
      setBooking(JSON.parse(bookingData));
    }
    setIsLoading(false);
  }, []);

  const handleAddToCalendar = () => {
    if (!booking) return;

    const startTime = new Date(booking.selectedSlot);
    const endTime = new Date(startTime.getTime() + 90 * 60000); // 1.5 години для клієнта

    const calendarUrl = generateCalendarUrl(
      `Фотосесія: ${booking.sessionType}`,
      `Фотосесія з Alina Gnusina\n\nТип: ${booking.sessionType}\nТривалість: ~1.5 години\n\nКонтакт: zlomyshen@gmail.com`,
      startTime,
      endTime,
      'Київ, Україна'
    );

    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        {/* Іконка успіху */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-24 mx-auto rounded-full bg-green-500/10 flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </svg>
        </motion.div>

        {/* Заголовок */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-light tracking-tight"
          >
            Дякую за бронювання! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-foreground/70"
          >
            Оплата успішно пройшла
          </motion.p>
        </div>

        {/* Інформація */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 text-left space-y-4"
        >
          <h3 className="text-lg font-medium">Що далі?</h3>
          <ul className="space-y-3 text-foreground/70">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span>Зйомку заблоковано в календарі на <strong>2 години</strong> (зйомка + час на переїзд)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span>На email <strong>{booking?.email || 'вказаний при бронюванні'}</strong> надішлю підтвердження з деталями протягом години</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span>Зв'яжуся з тобою за день до зйомки для уточнення локації та інших деталей</span>
            </li>
          </ul>
        </motion.div>

        {/* Додаткова інфо про оплату */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm text-foreground/60 space-y-2"
        >
          <p>
            <strong>Оплачено:</strong> 30% передплата
          </p>
          <p>
            Залишок 70% сплачується після зйомки, перед отриманням перших результатів
          </p>
          <p className="pt-2 border-t border-foreground/10 mt-4">
            Готові фото отримаєш через <strong>7-14 днів</strong> після зйомки
          </p>
        </motion.div>

        {/* Додати в календар */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-6"
        >
          <motion.button
            onClick={handleAddToCalendar}
            className="w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-medium shadow-lg flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Додати в мій календар
          </motion.button>
          <p className="text-xs text-center text-foreground/40 mt-3">
            Google Calendar, Apple Calendar, Outlook - будь-який
          </p>
        </motion.div>

        {/* Кнопки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
        >
          <Link href="/">
            <motion.button
              className="px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Повернутися на головну
            </motion.button>
          </Link>
          <Link href="/#portfolio">
            <motion.button
              className="px-8 py-4 rounded-full border border-foreground/20 text-foreground text-sm font-medium hover:bg-foreground/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Подивитись роботи
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
