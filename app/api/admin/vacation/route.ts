import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';

export async function GET() {
  try {
    const vacations = await prisma.vacationBlock.findMany({
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(vacations);
  } catch (error: any) {
    console.error('Error loading vacations:', error);
    return NextResponse.json(
      { error: 'Failed to load vacations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, reason } = await request.json();

    // Створюємо блокування
    const vacation = await prisma.vacationBlock.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate + 'T23:59:59'),
        reason: reason || null,
      },
    });

    // Додаємо події в Google Calendar
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

      // Створюємо подію на весь період
      const event = {
        summary: `🏖️ ${reason || 'Заблоковано'}`,
        description: 'Дати заблоковані для бронювання',
        start: {
          date: startDate,
          timeZone: 'Europe/Kiev',
        },
        end: {
          // End date is exclusive in Google Calendar, so add 1 day
          date: new Date(new Date(endDate).getTime() + 86400000).toISOString().split('T')[0],
          timeZone: 'Europe/Kiev',
        },
        colorId: '11', // Red color
      };

      const calendarResponse = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: event,
      });

      // Оновлюємо vacation з calendar event ID
      await prisma.vacationBlock.update({
        where: { id: vacation.id },
        data: { calendarEventId: calendarResponse.data.id || null },
      });

      console.log('✓ Vacation added to Google Calendar');
    } catch (calendarError) {
      console.error('Failed to add to calendar:', calendarError);
      // Не падаємо, якщо календар не створився
    }

    return NextResponse.json(vacation);
  } catch (error: any) {
    console.error('Error creating vacation:', error);
    return NextResponse.json(
      { error: 'Failed to create vacation' },
      { status: 500 }
    );
  }
}
