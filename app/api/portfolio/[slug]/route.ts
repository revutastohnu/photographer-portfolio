import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - отримати одну фотосесію за slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const session = await prisma.photoSession.findUnique({
      where: { slug, isActive: true },
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
