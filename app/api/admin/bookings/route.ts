import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // В production тут має бути перевірка auth токена
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Базовий запит
    const where: any = {};

    // Фільтр по статусу
    if (status && status !== 'all') {
      where.status = status;
    }

    // Пошук по імені або email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Отримуємо бронювання
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Статистика
    const stats = await prisma.booking.groupBy({
      by: ['status'],
      _count: true,
    });

    const statsFormatted = {
      total: bookings.length,
      pending: stats.find(s => s.status === 'pending')?._count || 0,
      paid: stats.find(s => s.status === 'paid')?._count || 0,
      failed: stats.find(s => s.status === 'failed')?._count || 0,
      expired: stats.find(s => s.status === 'expired')?._count || 0,
    };

    return NextResponse.json({
      bookings,
      stats: statsFormatted,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', message: error.message },
      { status: 500 }
    );
  }
}
