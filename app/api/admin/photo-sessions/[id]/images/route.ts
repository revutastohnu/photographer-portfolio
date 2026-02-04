import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - додати зображення до фотосесії
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id: sessionId } = await params;

    // Перевіряємо чи існує фотосесія
    const session = await prisma.photoSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Photo session not found' },
        { status: 404 }
      );
    }

    // Якщо це перше зображення або позначено як обкладинка - робимо його обкладинкою
    const imagesCount = await prisma.photoSessionImage.count({
      where: { sessionId },
    });

    const isCover = data.isCover || imagesCount === 0;

    // Якщо це нова обкладинка - знімаємо позначку з інших
    if (isCover) {
      await prisma.photoSessionImage.updateMany({
        where: { sessionId, isCover: true },
        data: { isCover: false },
      });
    }

    const image = await prisma.photoSessionImage.create({
      data: {
        sessionId,
        url: data.url,
        fileName: data.fileName,
        alt: data.alt || null,
        order: data.order ?? imagesCount,
        isCover,
      },
    });

    return NextResponse.json(image);
  } catch (error: any) {
    console.error('Error creating image:', error);
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}

// PATCH - оновити порядок зображень або встановити обкладинку
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id: sessionId } = await params;

    // Якщо передано новий порядок зображень
    if (data.reorder && Array.isArray(data.reorder)) {
      const updates = data.reorder.map((item: { id: string; order: number }) =>
        prisma.photoSessionImage.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      );

      await prisma.$transaction(updates);

      const images = await prisma.photoSessionImage.findMany({
        where: { sessionId },
        orderBy: { order: 'asc' },
      });

      return NextResponse.json(images);
    }

    // Якщо встановлюємо нову обкладинку
    if (data.setCover) {
      await prisma.photoSessionImage.updateMany({
        where: { sessionId, isCover: true },
        data: { isCover: false },
      });

      await prisma.photoSessionImage.update({
        where: { id: data.setCover },
        data: { isCover: true },
      });

      const images = await prisma.photoSessionImage.findMany({
        where: { sessionId },
        orderBy: { order: 'asc' },
      });

      return NextResponse.json(images);
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating images:', error);
    return NextResponse.json(
      { error: 'Failed to update images' },
      { status: 500 }
    );
  }
}
