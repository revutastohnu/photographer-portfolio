'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WorkingHoursPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(15);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/working-hours');
      if (response.ok) {
        const data = await response.json();
        if (data.start !== undefined) setStartHour(data.start);
        if (data.end !== undefined) setEndHour(data.end);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: startHour, end: endHour }),
      });

      if (response.ok) {
        setMessage('Збережено успішно!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Помилка збереження');
      }
    } catch (err) {
      setMessage('Помилка підключення');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-sm text-foreground/60 hover:text-foreground">
            ← Назад до панелі
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-light mb-8">Робочі години</h1>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-border space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Початок робочого дня (година початку зйомок)
              </label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Кінець робочого дня (остання година початку зйомки)
              </label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}:00
                  </option>
                ))}
              </select>
              <p className="text-xs text-foreground/60 mt-2">
                Наприклад: якщо виберете 15:00, остання зйомка може ПОЧАТИСЯ о 15:00
              </p>
            </div>

            {message && (
              <div className={`text-sm text-center ${message.includes('успішно') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </div>
            )}

            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl bg-foreground text-background font-medium disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? 'Збереження...' : 'Зберегти'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
