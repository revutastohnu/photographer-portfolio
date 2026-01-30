'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SessionType {
  id: string;
  name: string;
  nameUk: string;
  price: number;
  depositPercent: number;
  duration: number;
  description: string | null;
  isActive: boolean;
  order: number;
}

export default function SessionTypesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SessionType>>({});

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    loadSessionTypes();
  }, [router]);

  const loadSessionTypes = async () => {
    try {
      const response = await fetch('/api/admin/session-types');
      if (response.ok) {
        const data = await response.json();
        setSessionTypes(data);
      }
    } catch (err) {
      console.error('Failed to load session types:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (type: SessionType) => {
    setEditingId(type.id);
    setFormData(type);
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      name: '',
      nameUk: '',
      price: 0,
      depositPercent: 30,
      duration: 120,
      description: '',
      isActive: true,
      order: sessionTypes.length,
    });
  };

  const handleSave = async () => {
    try {
      const url = editingId === 'new' 
        ? '/api/admin/session-types'
        : `/api/admin/session-types/${editingId}`;
      
      const method = editingId === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({});
        loadSessionTypes();
      }
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цей тип зйомки?')) return;

    try {
      const response = await fetch(`/api/admin/session-types/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadSessionTypes();
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
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            + Додати тип
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-light mb-8">Типи зйомок</h1>

          {editingId && (
            <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-border space-y-4">
              <h3 className="text-xl font-medium mb-4">
                {editingId === 'new' ? 'Новий тип зйомки' : 'Редагувати'}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Назва (EN)</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Назва (UA)</label>
                  <input
                    type="text"
                    value={formData.nameUk || ''}
                    onChange={(e) => setFormData({ ...formData, nameUk: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Ціна (грн)</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Передплата (%)</label>
                  <input
                    type="number"
                    value={formData.depositPercent || 30}
                    onChange={(e) => setFormData({ ...formData, depositPercent: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Тривалість (хв)</label>
                  <input
                    type="number"
                    value={formData.duration || 120}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Порядок</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Опис</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm">Активний</label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-xl bg-foreground text-background hover:opacity-80"
                >
                  Зберегти
                </button>
                <button
                  onClick={() => { setEditingId(null); setFormData({}); }}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10"
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {sessionTypes.map((type) => (
              <div
                key={type.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-medium">{type.nameUk}</h3>
                    <p className="text-sm text-foreground/60 mt-1">{type.description}</p>
                    <div className="flex gap-4 mt-3 text-sm text-foreground/80">
                      <span>💰 {type.price} грн</span>
                      <span>⏱️ {type.duration} хв</span>
                      <span>📥 {type.depositPercent}% передплата</span>
                      <span className={type.isActive ? 'text-green-500' : 'text-red-500'}>
                        {type.isActive ? '✓ Активний' : '✗ Неактивний'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(type)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
