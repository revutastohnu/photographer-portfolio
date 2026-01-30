import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sessionTypes = await prisma.sessionType.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(sessionTypes);
  } catch (error: any) {
    console.error('Error loading session types:', error);
    return NextResponse.json(
      { error: 'Failed to load session types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const sessionType = await prisma.sessionType.create({
      data: {
        name: data.name,
        nameUk: data.nameUk,
        price: data.price,
        depositPercent: data.depositPercent || 30,
        duration: data.duration || 120,
        description: data.description || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: data.order || 0,
      },
    });

    return NextResponse.json(sessionType);
  } catch (error: any) {
    console.error('Error creating session type:', error);
    return NextResponse.json(
      { error: 'Failed to create session type' },
      { status: 500 }
    );
  }
}
