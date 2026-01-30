import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const sessionType = await prisma.sessionType.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sessionType.delete({
      where: { id: params.id },
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
