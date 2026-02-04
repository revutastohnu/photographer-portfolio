import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - отримати всі активні фотосесії для публічної частини
export async function GET() {
  try {
    const sessions = await prisma.photoSession.findMany({
      where: { isActive: true },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
