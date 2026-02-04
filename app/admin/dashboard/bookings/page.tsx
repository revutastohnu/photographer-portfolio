'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Booking {
  id: string;
  invoiceId: string;
  name: string;
  email: string;
  phone: string | null;
  sessionType: string;
  selectedSlot: string;
  note: string | null;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  amount: number;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  paid: number;
  failed: number;
  expired: number;
}

export default function BookingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, paid: 0, failed: 0, expired: 0 });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    loadBookings();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [statusFilter, searchQuery, isAuthenticated]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/bookings?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'expired':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-white/5 text-foreground/60 border-border';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return '✅ Оплачено';
      case 'pending':
        return '⏳ Очікує оплати';
      case 'failed':
        return '❌ Помилка';
      case 'expired':
        return '⌛ Термін вийшов';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-sm text-foreground/60 hover:text-foreground">
            ← Назад до панелі
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-light mb-8">Бронювання</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-border">
              <div className="text-3xl font-light mb-2">{stats.total}</div>
              <div className="text-sm text-foreground/60">Всього</div>
            </div>
            <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
              <div className="text-3xl font-light mb-2 text-green-500">{stats.paid}</div>
              <div className="text-sm text-green-500/80">Оплачено</div>
            </div>
            <div className="bg-yellow-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
              <div className="text-3xl font-light mb-2 text-yellow-500">{stats.pending}</div>
              <div className="text-sm text-yellow-500/80">Очікує</div>
            </div>
            <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
              <div className="text-3xl font-light mb-2 text-red-500">{stats.failed}</div>
              <div className="text-sm text-red-500/80">Помилка</div>
            </div>
            <div className="bg-gray-500/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-500/20">
              <div className="text-3xl font-light mb-2 text-gray-500">{stats.expired}</div>
              <div className="text-sm text-gray-500/80">Прострочено</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-border mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Фільтр по статусу</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
                >
                  <option value="all">Всі статуси</option>
                  <option value="paid">Оплачено</option>
                  <option value="pending">Очікує оплати</option>
                  <option value="failed">Помилка</option>
                  <option value="expired">Прострочено</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Пошук</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ім'я або email..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-border text-center">
              <p className="text-foreground/60">Немає бронювань для відображення</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-border hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Main Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-medium">{booking.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60">{booking.email}</p>
                      {booking.phone && (
                        <p className="text-sm text-foreground/60">📱 {booking.phone}</p>
                      )}
                    </div>

                    {/* Session Details */}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="text-foreground/60">Тип зйомки:</span> {booking.sessionType}
                      </p>
                      <p className="text-sm">
                        <span className="text-foreground/60">Дата:</span> {formatDate(booking.selectedSlot)}
                      </p>
                      <p className="text-sm">
                        <span className="text-foreground/60">Сума:</span> {booking.amount} грн
                      </p>
                    </div>

                    {/* Created Date */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-foreground/40">
                        Створено: {new Date(booking.createdAt).toLocaleDateString('uk-UA', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedBooking?.id === booking.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-border space-y-2"
                    >
                      <p className="text-sm">
                        <span className="text-foreground/60">Invoice ID:</span> {booking.invoiceId}
                      </p>
                      {booking.note && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Нотатка:</p>
                          <p className="text-sm bg-white/5 rounded-xl p-3">{booking.note}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
