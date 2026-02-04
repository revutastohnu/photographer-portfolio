import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - отримати одну фотосесію
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.photoSession.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Photo session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Error fetching photo session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo session' },
      { status: 500 }
    );
  }
}

// PUT - оновити фотосесію
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id } = await params;

    const session = await prisma.photoSession.update({
      where: { id },
      data: {
        title: data.title,
        titleUk: data.titleUk,
        year: data.year,
        location: data.location,
        locationUk: data.locationUk,
        description: data.description || null,
        descriptionUk: data.descriptionUk || null,
        tags: data.tags || [],
        order: data.order,
        isActive: data.isActive,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Error updating photo session:', error);
    return NextResponse.json(
      { error: 'Failed to update photo session' },
      { status: 500 }
    );
  }
}

// DELETE - видалити фотосесію
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.photoSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting photo session:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo session' },
      { status: 500 }
    );
  }
}
