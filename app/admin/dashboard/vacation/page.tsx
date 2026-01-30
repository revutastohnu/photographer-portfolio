'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface VacationBlock {
  id: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  calendarEventId: string | null;
}

export default function VacationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vacations, setVacations] = useState<VacationBlock[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    loadVacations();
  }, [router]);

  const loadVacations = async () => {
    try {
      const response = await fetch('/api/admin/vacation');
      if (response.ok) {
        const data = await response.json();
        setVacations(data);
      }
    } catch (err) {
      console.error('Failed to load vacations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.startDate || !formData.endDate) {
      alert('Вкажіть дати');
      return;
    }

    try {
      const response = await fetch('/api/admin/vacation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsCreating(false);
        setFormData({ startDate: '', endDate: '', reason: '' });
        loadVacations();
      }
    } catch (err) {
      console.error('Failed to create:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити блокування?')) return;

    try {
      const response = await fetch(`/api/admin/vacation/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadVacations();
      }
    } catch (err) {
      console.error('Failed to delete:', err);
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
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            + Заблокувати дати
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-light mb-4">Відпустка / Блокування дат</h1>
          <p className="text-foreground/60 mb-8">
            Заблоковані дати автоматично додаються в Google Calendar і недоступні для бронювання
          </p>

          {isCreating && (
            <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-border space-y-4">
              <h3 className="text-xl font-medium mb-4">Заблокувати дати</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Дата початку</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Дата кінця</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Причина (опціонально)</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Наприклад: Відпустка, Свята, тощо"
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 rounded-xl bg-foreground text-background hover:opacity-80"
                >
                  Заблокувати
                </button>
                <button
                  onClick={() => { setIsCreating(false); setFormData({ startDate: '', endDate: '', reason: '' }); }}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10"
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {vacations.length === 0 ? (
              <div className="text-center text-foreground/60 py-12">
                Немає заблокованих дат
              </div>
            ) : (
              vacations.map((vacation) => {
                const start = new Date(vacation.startDate);
                const end = new Date(vacation.endDate);
                return (
                  <div
                    key={vacation.id}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          {start.toLocaleDateString('uk-UA')} — {end.toLocaleDateString('uk-UA')}
                        </h3>
                        {vacation.reason && (
                          <p className="text-sm text-foreground/60 mt-1">{vacation.reason}</p>
                        )}
                        {vacation.calendarEventId && (
                          <p className="text-xs text-green-500 mt-2">✓ Додано в календар</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(vacation.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
