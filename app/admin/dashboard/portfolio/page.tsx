'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface PhotoSessionImage {
  id: string;
  url: string;
  fileName: string;
  alt: string | null;
  order: number;
  isCover: boolean;
}

interface PhotoSession {
  id: string;
  slug: string;
  title: string;
  titleUk: string;
  year: number;
  location: string;
  locationUk: string;
  description: string | null;
  descriptionUk: string | null;
  tags: string[];
  order: number;
  isActive: boolean;
  images: PhotoSessionImage[];
}

export default function PortfolioPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PhotoSession>>({});
  const [tagsInput, setTagsInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    loadSessions();
  }, [router]);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/admin/photo-sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Failed to load photo sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      title: '',
      titleUk: '',
      year: new Date().getFullYear(),
      location: '',
      locationUk: '',
      description: '',
      descriptionUk: '',
      tags: [],
      order: sessions.length,
      isActive: true,
      images: [],
    });
    setTagsInput('');
  };

  const handleEdit = (session: PhotoSession) => {
    setEditingId(session.id);
    setFormData(session);
    setTagsInput(session.tags.join(', '));
  };

  const handleSave = async () => {
    try {
      // Парсимо теги
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const dataToSave = { ...formData, tags };

      const url = editingId === 'new'
        ? '/api/admin/photo-sessions'
        : `/api/admin/photo-sessions/${editingId}`;

      const method = editingId === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({});
        setTagsInput('');
        loadSessions();
      }
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Помилка при збереженні');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цю фотосесію? Всі фотографії також будуть видалені.')) return;

    try {
      const response = await fetch(`/api/admin/photo-sessions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadSessions();
      } else {
        const error = await response.json();
        alert(error.error || 'Помилка при видаленні');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Помилка при видаленні');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (editingId === 'new') {
      alert('Спочатку збережіть фотосесію, потім завантажуйте фото');
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionSlug', formData.slug || 'uploads');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const { url, fileName } = await uploadResponse.json();

          // Додаємо зображення до сесії
          await fetch(`/api/admin/photo-sessions/${editingId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, fileName }),
          });
        }
      }

      loadSessions();
      if (editingId) {
        const response = await fetch(`/api/admin/photo-sessions/${editingId}`);
        if (response.ok) {
          const session = await response.json();
          setFormData(session);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Помилка при завантаженні файлів');
    } finally {
      setUploading(false);
    }
  };

  const handleSetCover = async (imageId: string) => {
    if (!editingId || editingId === 'new') return;

    try {
      const response = await fetch(`/api/admin/photo-sessions/${editingId}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setCover: imageId }),
      });

      if (response.ok) {
        const images = await response.json();
        setFormData({ ...formData, images });
        loadSessions();
      }
    } catch (err) {
      console.error('Failed to set cover:', err);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!editingId || editingId === 'new') return;
    if (!confirm('Видалити цю фотографію?')) return;

    try {
      const response = await fetch(`/api/admin/photo-sessions/${editingId}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedImages = formData.images?.filter(img => img.id !== imageId);
        setFormData({ ...formData, images: updatedImages });
        loadSessions();
      }
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Помилка при видаленні фото');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getCoverImage = (session: PhotoSession) => {
    const cover = session.images.find(img => img.isCover);
    return cover || session.images[0];
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
      <header className="border-b border-border bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-sm text-foreground/60 hover:text-foreground">
            ← Назад до панелі
          </Link>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            + Додати фотосесію
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-light mb-8">Портфоліо</h1>

          {editingId && (
            <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-border">
              <h3 className="text-xl font-medium mb-6">
                {editingId === 'new' ? 'Нова фотосесія' : 'Редагувати фотосесію'}
              </h3>

              <div className="space-y-6">
                {/* Основна інформація */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Назва (EN)</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Назва (UA)</label>
                    <input
                      type="text"
                      value={formData.titleUk || ''}
                      onChange={(e) => setFormData({ ...formData, titleUk: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Рік</label>
                    <input
                      type="number"
                      value={formData.year || new Date().getFullYear()}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Порядок</label>
                    <input
                      type="number"
                      value={formData.order || 0}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Локація (EN)</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Локація (UA)</label>
                    <input
                      type="text"
                      value={formData.locationUk || ''}
                      onChange={(e) => setFormData({ ...formData, locationUk: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Теги (через кому)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="portrait, natural-light, outdoor"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Опис (EN)</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Опис (UA)</label>
                    <textarea
                      value={formData.descriptionUk || ''}
                      onChange={(e) => setFormData({ ...formData, descriptionUk: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-border focus:outline-none focus:border-foreground/50"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm">Активна (відображається на сайті)</label>
                </div>

                {/* Галерея фотографій */}
                {editingId !== 'new' && (
                  <div className="border-t border-border pt-6">
                    <h4 className="text-lg font-medium mb-4">Фотографії</h4>

                    {/* Upload область */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        dragOver
                          ? 'border-foreground bg-foreground/5'
                          : 'border-border hover:border-foreground/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                      {uploading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
                          <span>Завантаження...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg mb-2">Перетягніть фото сюди або клікніть</p>
                          <p className="text-sm text-foreground/60">Підтримуються JPEG, PNG, WebP, GIF (до 10MB)</p>
                        </div>
                      )}
                    </div>

                    {/* Список фотографій */}
                    {formData.images && formData.images.length > 0 && (
                      <div className="mt-6 grid grid-cols-4 gap-4">
                        {formData.images.map((image) => (
                          <div
                            key={image.id}
                            className="relative group rounded-xl overflow-hidden bg-white/5 aspect-square"
                          >
                            <Image
                              src={image.url}
                              alt={image.alt || ''}
                              fill
                              className="object-cover"
                            />
                            {image.isCover && (
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg">
                                Обкладинка
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!image.isCover && (
                                <button
                                  onClick={() => handleSetCover(image.id)}
                                  className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                >
                                  Зробити обкладинкою
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteImage(image.id)}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                              >
                                Видалити
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Кнопки дій */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-foreground text-background hover:opacity-80"
                  >
                    {editingId === 'new' ? 'Створити' : 'Зберегти'}
                  </button>
                  <button
                    onClick={() => { setEditingId(null); setFormData({}); setTagsInput(''); }}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10"
                  >
                    Скасувати
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Список фотосесій */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sessions.map((session) => {
                const cover = getCoverImage(session);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-border group"
                  >
                    {cover && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={cover.url}
                          alt={session.titleUk}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-medium">{session.titleUk}</h3>
                          <p className="text-sm text-foreground/60">{session.year} • {session.locationUk}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-lg ${
                          session.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {session.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 mb-4">
                        {session.images.length} фото
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(session)}
                          className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {sessions.length === 0 && !editingId && (
            <div className="text-center py-16 text-foreground/60">
              <p className="text-lg mb-4">Немає фотосесій</p>
              <button
                onClick={handleCreate}
                className="px-6 py-3 rounded-xl bg-foreground text-background hover:opacity-80"
              >
                Створити першу фотосесію
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
