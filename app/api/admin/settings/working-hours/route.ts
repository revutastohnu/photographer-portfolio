import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'working_hours' },
    });

    if (setting) {
      const value = JSON.parse(setting.value);
      return NextResponse.json(value);
    }

    // Default values
    return NextResponse.json({ start: 9, end: 15 });
  } catch (error: any) {
    console.error('Error loading working hours:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { start, end } = await request.json();

    await prisma.settings.upsert({
      where: { key: 'working_hours' },
      update: {
        value: JSON.stringify({ start, end }),
      },
      create: {
        key: 'working_hours',
        value: JSON.stringify({ start, end }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving working hours:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
