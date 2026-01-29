'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PaymentStepProps {
  bookingData: any;
}

export default function PaymentStep({ bookingData }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Розраховуємо суму (30% передплата)
  const sessionPrices: Record<string, number> = {
    portrait: 3000,
    couple: 4000,
    wedding: 15000,
    editorial: 5000,
  };

  const fullPrice = sessionPrices[bookingData.sessionType] || 3000;
  // ТЕСТОВИЙ РЕЖИМ: мінімальна сума 1 грн
  const depositAmount = 1; // Math.round(fullPrice * 0.3); // 30% передплата

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Зберігаємо дані для success сторінки
      sessionStorage.setItem('lastBooking', JSON.stringify(bookingData));

      // Створюємо інвойс в Monobank
      const response = await fetch('/api/monobank/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData,
          amount: depositAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не вдалося створити рахунок');
      }

      // Редірект на сторінку оплати Monobank
      window.location.href = data.pageUrl;
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Сталася помилка. Спробуйте ще раз.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-3xl font-light">Оплата</h3>
        <div className="text-lg text-foreground/70 space-y-3">
          <p>
            <strong>30%</strong> передплата для підтвердження бронювання
          </p>
          <p>
            <strong>70%</strong> після зйомки та отримання перших результатів
          </p>
          <p className="text-base pt-2 border-t border-foreground/10">
            Готові фото отримаєш через <strong>7-14 днів</strong> після зйомки
          </p>
        </div>
      </div>

      {/* Інформація про суму */}
      <div className="p-8 rounded-2xl border border-foreground/20 bg-foreground/5 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Тип зйомки</span>
            <span className="font-medium capitalize">{bookingData.sessionType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Повна вартість</span>
            <span className="font-medium">{fullPrice} ₴</span>
          </div>
          <div className="flex justify-between text-lg pt-3 border-t border-foreground/10">
            <span className="font-medium">До сплати зараз (30%)</span>
            <span className="font-medium">{depositAmount} ₴</span>
          </div>
          <div className="flex justify-between text-sm text-foreground/60">
            <span>Залишок після зйомки</span>
            <span>{fullPrice - depositAmount} ₴</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Перенаправлення...
            </span>
          ) : (
            'Оплатити через Monobank'
          )}
        </motion.button>

        <p className="text-xs text-center text-foreground/40">
          Безпечна оплата через monobank acquiring
        </p>
      </div>

      {/* Деталі бронювання */}
      <div className="p-6 rounded-2xl bg-foreground/5">
        <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">Деталі бронювання</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/60">Ім'я</span>
            <span>{bookingData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Email</span>
            <span>{bookingData.email}</span>
          </div>
          {bookingData.phone && (
            <div className="flex justify-between">
              <span className="text-foreground/60">Телефон</span>
              <span>{bookingData.phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground/60">Дата та час</span>
            <span>
              {new Date(bookingData.selectedSlot).toLocaleString('uk-UA', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
