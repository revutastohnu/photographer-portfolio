import { NextRequest, NextResponse } from 'next/server';
import { MonobankWebhookPayload } from '@/lib/monobank.types';
import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';
import { telegramBot } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const webhook: MonobankWebhookPayload = await request.json();
    
    console.log('Monobank webhook received:', webhook);

    // Знаходимо бронювання в БД
    const booking = await prisma.booking.findUnique({
      where: { invoiceId: webhook.invoiceId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Оновлюємо статус
    let updatedBooking = booking;
    
    if (webhook.status === 'success') {

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

        await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          requestBody: event,
        });

        console.log('Google Calendar event created');
      } catch (calendarError) {
        console.error('Failed to create calendar event:', calendarError);
        // Не падаємо, якщо календар не створився
      }

      // Відправляємо сповіщення в Telegram
      try {
        const telegramMessage = telegramBot.formatPaymentNotification({
          name: booking.name,
          sessionType: booking.sessionType,
          selectedSlot: new Date(booking.selectedSlot),
          amount: booking.amount,
        });

        await telegramBot.sendMessage(telegramMessage);
      } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError);
        // Не падаємо, якщо сповіщення не відправилось
      }

      // Оновлюємо статус в БД
      updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'paid' },
      });
    } else if (webhook.status === 'failure') {
      updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'failed' },
      });
    } else if (webhook.status === 'expired') {
      updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'expired' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
