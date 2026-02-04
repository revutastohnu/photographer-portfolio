import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';

// DELETE - видалити зображення
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: sessionId, imageId } = await params;

    const image = await prisma.photoSessionImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Якщо це була обкладинка, встановлюємо першу наступну як обкладинку
    if (image.isCover) {
      const nextImage = await prisma.photoSessionImage.findFirst({
        where: {
          sessionId,
          id: { not: imageId },
        },
        orderBy: { order: 'asc' },
      });

      if (nextImage) {
        await prisma.photoSessionImage.update({
          where: { id: nextImage.id },
          data: { isCover: true },
        });
      }
    }

    // Видаляємо файл з файлової системи
    try {
      const filePath = path.join(process.cwd(), 'public', image.url);
      await unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
      // Продовжуємо навіть якщо файл не знайдено
    }

    // Видаляємо запис з БД
    await prisma.photoSessionImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// PATCH - оновити зображення
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const data = await request.json();
    const { imageId } = await params;

    const image = await prisma.photoSessionImage.update({
      where: { id: imageId },
      data: {
        alt: data.alt,
        order: data.order,
      },
    });

    return NextResponse.json(image);
  } catch (error: any) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}
