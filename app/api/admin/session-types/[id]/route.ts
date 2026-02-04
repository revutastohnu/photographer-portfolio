import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id } = await params;

    // Перевіряємо чи не намагаємося вимкнути останній активний тип
    if (data.isActive === false) {
      const currentType = await prisma.sessionType.findUnique({
        where: { id },
      });

      if (currentType?.isActive) {
        const activeCount = await prisma.sessionType.count({
          where: { isActive: true },
        });

        if (activeCount <= 1) {
          return NextResponse.json(
            { error: 'Неможливо вимкнути останній активний тип зйомки. Має залишитися хоча б один активний тип.' },
            { status: 400 }
          );
        }
      }
    }

    const sessionType = await prisma.sessionType.update({
      where: { id },
      data: {
        name: data.name,
        nameUk: data.nameUk,
        price: data.price,
        depositPercent: data.depositPercent,
        duration: data.duration,
        description: data.description || null,
        isActive: data.isActive,
        order: data.order,
      },
    });

    return NextResponse.json(sessionType);
  } catch (error: any) {
    console.error('Error updating session type:', error);
    return NextResponse.json(
      { error: 'Failed to update session type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Перевіряємо чи не видаляємо останній активний тип
    const typeToDelete = await prisma.sessionType.findUnique({
      where: { id },
    });

    if (typeToDelete?.isActive) {
      const activeCount = await prisma.sessionType.count({
        where: { isActive: true },
      });

      if (activeCount <= 1) {
        return NextResponse.json(
          { error: 'Неможливо видалити останній активний тип зйомки. Має залишитися хоча б один активний тип.' },
          { status: 400 }
        );
      }
    }

    await prisma.sessionType.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting session type:', error);
    return NextResponse.json(
      { error: 'Failed to delete session type' },
      { status: 500 }
    );
  }
}
