'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TimeSlot, BookingFormData } from '@/lib/types';

interface BookingFormProps {
  selectedSlot: TimeSlot | null;
  onSubmit: (data: BookingFormData) => void;
  isSubmitting: boolean;
}

export default function BookingForm({
  selectedSlot,
  onSubmit,
  isSubmitting,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: '',
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert('Будь ласка, обери слот часу');
      return;
    }

    onSubmit({
      ...formData,
      selectedSlot: selectedSlot.startISO,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Ім'я *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-xl border border-foreground/20 bg-transparent focus:border-foreground/60 focus:outline-none transition-colors duration-300"
          placeholder="Твоє ім'я"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-xl border border-foreground/20 bg-transparent focus:border-foreground/60 focus:outline-none transition-colors duration-300"
          placeholder="your.email@example.com"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium">
          Телефон / Telegram
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl border border-foreground/20 bg-transparent focus:border-foreground/60 focus:outline-none transition-colors duration-300"
          placeholder="+380 xx xxx xx xx"
        />
      </div>

      {/* Session Type */}
      <div className="space-y-2">
        <label htmlFor="sessionType" className="block text-sm font-medium">
          Тип зйомки *
        </label>
        <select
          id="sessionType"
          name="sessionType"
          value={formData.sessionType}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-xl border border-foreground/20 bg-background focus:border-foreground/60 focus:outline-none transition-colors duration-300"
        >
          <option value="">Обери тип зйомки</option>
          <option value="portrait">Портрет</option>
          <option value="couple">Пара / Лавсторі</option>
          <option value="wedding">Весілля</option>
          <option value="editorial">Editorial / Креатив</option>
        </select>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <label htmlFor="note" className="block text-sm font-medium">
          Твоя ідея
        </label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={4}
          className="w-full px-5 py-3 rounded-xl border border-foreground/20 bg-transparent focus:border-foreground/60 focus:outline-none transition-colors duration-300 resize-none"
          placeholder="Розкажи про свою ідею, локацію, настрій..."
        />
      </div>

      {/* Selected Slot Display */}
      {selectedSlot && (
        <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
          <p className="text-sm text-foreground/60">Обраний час:</p>
          <p className="font-medium">{selectedSlot.label}</p>
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting || !selectedSlot}
        className="w-full px-8 py-4 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform duration-300"
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      >
        {isSubmitting ? 'Відправляємо...' : 'Далі до оплати'}
      </motion.button>
    </form>
  );
}
