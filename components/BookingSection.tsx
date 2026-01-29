'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TimeSlot, BookingFormData } from '@/lib/types';
import BookingCalendar from './BookingCalendar';
import BookingForm from './BookingForm';
import PaymentStep from './PaymentStep';

type BookingStep = 'availability' | 'details' | 'payment' | 'success';

export default function BookingSection() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('availability');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleContinueToForm = () => {
    if (selectedSlot) {
      setCurrentStep('details');
    }
  };

  const handleFormSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setBookingData(data);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }

      setCurrentStep('payment');
    } catch (error: any) {
      console.error('Booking error:', error);
      alert('Не вдалося відправити заявку. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('availability');
    } else if (currentStep === 'payment') {
      setCurrentStep('details');
    }
  };

  return (
    <div className="max-w-4xl space-y-12">
      {/* Header */}
      <div className="space-y-6">
        <motion.div
          className="w-16 h-[2px] bg-foreground"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.h2
          className="text-5xl md:text-7xl font-light tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Забронювати зйомку
        </motion.h2>
        <motion.div
          className="space-y-4 text-lg md:text-xl text-foreground/70 leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>
            Обери зручний час, розкажи про свою ідею — і я зв'яжуся з тобою протягом доби.
          </p>
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 space-y-2 text-base">
            <p><strong>Оплата:</strong> 30% передплата для бронювання, 70% після зйомки та отримання перших результатів</p>
            <p><strong>Терміни:</strong> готові фото через 7-14 днів після зйомки</p>
          </div>
        </motion.div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { id: 'availability', label: '1. Час' },
          { id: 'details', label: '2. Твої дані' },
          { id: 'payment', label: '3. Оплата' },
        ].map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            <div
              className={`text-sm transition-opacity duration-300 ${
                currentStep === step.id
                  ? 'opacity-100 font-medium'
                  : 'opacity-40'
              }`}
            >
              {step.label}
            </div>
            {index < 2 && (
              <div className="w-8 h-[1px] bg-foreground/20" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 'availability' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <BookingCalendar
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
            {selectedSlot && (
              <div className="flex justify-end pt-4 border-t border-foreground/10">
                <motion.button
                  onClick={handleContinueToForm}
                  className="px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium hover:scale-105 transition-transform duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Далі
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 'details' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <BookingForm
              selectedSlot={selectedSlot}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
            <button
              onClick={handleBack}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-300"
            >
              ← Назад до вибору часу
            </button>
          </motion.div>
        )}

        {currentStep === 'payment' && bookingData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <PaymentStep bookingData={bookingData} />
            <button
              onClick={handleBack}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-300"
            >
              ← Назад
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
