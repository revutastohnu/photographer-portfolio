import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - отримати всі фотосесії
export async function GET() {
  try {
    const sessions = await prisma.photoSession.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error('Error fetching photo sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo sessions' },
      { status: 500 }
    );
  }
}

// POST - створити нову фотосесію
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Генеруємо slug з title якщо не вказано
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const session = await prisma.photoSession.create({
      data: {
        slug,
        title: data.title,
        titleUk: data.titleUk,
        year: data.year,
        location: data.location,
        locationUk: data.locationUk,
        description: data.description || null,
        descriptionUk: data.descriptionUk || null,
        tags: data.tags || [],
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Error creating photo session:', error);
    return NextResponse.json(
      { error: 'Failed to create photo session' },
      { status: 500 }
    );
  }
}
