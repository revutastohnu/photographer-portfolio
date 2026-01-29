import { NextRequest, NextResponse } from 'next/server';
import { MonobankWebhookPayload } from '@/lib/monobank.types';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const webhook: MonobankWebhookPayload = await request.json();
    
    console.log('Monobank webhook received:', webhook);

    const fs = require('fs');
    const path = require('path');
    const bookingsPath = path.join(process.cwd(), 'data', 'bookings.json');

    // Читаємо бронювання
    if (!fs.existsSync(bookingsPath)) {
      return NextResponse.json({ error: 'Bookings file not found' }, { status: 404 });
    }

    const data = fs.readFileSync(bookingsPath, 'utf-8');
    const bookings = JSON.parse(data);

    // Знаходимо бронювання
    const bookingIndex = bookings.findIndex((b: any) => b.invoiceId === webhook.invoiceId);
    if (bookingIndex === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookings[bookingIndex];

    // Оновлюємо статус
    if (webhook.status === 'success') {
      booking.status = 'paid';
      booking.paidAt = new Date().toISOString();

      // Створюємо подію в Google Calendar
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

        const startTime = new Date(booking.selectedSlot);
        const endTime = new Date(startTime.getTime() + 120 * 60000); // +120 хвилин (2 години)

        const event = {
          summary: `📸 Фотосесія: ${booking.sessionType}`,
          description: `Клієнт: ${booking.name}\nEmail: ${booking.email}\nТелефон: ${booking.phone || 'не вказано'}\nНотатки: ${booking.note || 'немає'}\n\n⏰ Тривалість: ~1.5 години\n📍 Заблоковано 2 години для переїзду`,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'Europe/Kiev',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'Europe/Kiev',
          },
          // Не додаємо attendees через обмеження Service Account
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 30 },
            ],
          },
        };

        const calendarResponse = await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          requestBody: event,
        });

        booking.calendarEventId = calendarResponse.data.id;
        console.log('Google Calendar event created:', calendarResponse.data.id);
      } catch (calendarError) {
        console.error('Failed to create calendar event:', calendarError);
        // Не падаємо, якщо календар не створився
      }
    } else if (webhook.status === 'failure') {
      booking.status = 'failed';
    } else if (webhook.status === 'expired') {
      booking.status = 'expired';
    }

    // Зберігаємо оновлення
    bookings[bookingIndex] = booking;
    fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
