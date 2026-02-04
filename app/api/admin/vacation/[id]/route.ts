import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Знаходимо vacation
    const vacation = await prisma.vacationBlock.findUnique({
      where: { id },
    });

    if (!vacation) {
      return NextResponse.json(
        { error: 'Vacation not found' },
        { status: 404 }
      );
    }

    // Видаляємо з Google Calendar якщо є eventId
    if (vacation.calendarEventId) {
      try {
        const credentials = {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        const auth = new google.auth.JWT({
          email: credentials.client_email,
          key: credentials.private_key,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const calendar = google.calendar({ version: 'v3', auth });

        await calendar.events.delete({
          calendarId: process.env.GOOGLE_CALENDAR_ID!,
          eventId: vacation.calendarEventId,
        });

        console.log('✓ Event deleted from Google Calendar');
      } catch (calendarError) {
        console.error('Failed to delete from calendar:', calendarError);
        // Продовжуємо навіть якщо не вдалось видалити з календаря
      }
    }

    // Видаляємо з БД
    await prisma.vacationBlock.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting vacation:', error);
    return NextResponse.json(
      { error: 'Failed to delete vacation' },
      { status: 500 }
    );
  }
}
