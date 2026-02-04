import { NextRequest, NextResponse } from 'next/server';
import { MonobankInvoiceRequest, MonobankInvoiceResponse } from '@/lib/monobank.types';
import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingData, amount } = body;

    // Перевіряємо наявність токена
    const monobankToken = process.env.MONOBANK_TOKEN;
    if (!monobankToken) {
      return NextResponse.json(
        { error: 'Monobank token not configured' },
        { status: 500 }
      );
    }

    // Формуємо дані для інвойсу
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('Creating invoice with base URL:', baseUrl);
    
    const invoiceData: MonobankInvoiceRequest = {
      amount: amount * 100, // конвертуємо в копійки
      ccy: 980, // UAH
      merchantPaymInfo: {
        reference: `booking-${Date.now()}`,
        destination: 'Фотосесія з Alina Gnusina',
        comment: `${bookingData.sessionType} - ${bookingData.name}`,
        basketOrder: [
          {
            name: `Фотосесія: ${bookingData.sessionType}`,
            qty: 1,
            sum: amount * 100,
            unit: 'шт',
          },
        ],
      },
      redirectUrl: `${baseUrl}/booking/success`,
      webHookUrl: `${baseUrl}/api/monobank/webhook`, // Ngrok для webhook
      validity: 3600, // 1 година
      paymentType: 'debit',
    };
    
    console.log('Webhook URL:', invoiceData.webHookUrl);

    // Створюємо інвойс в Monobank
    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': monobankToken,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Monobank API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create invoice', details: errorData },
        { status: response.status }
      );
    }

    const invoiceResponse: MonobankInvoiceResponse = await response.json();

    // ТИМЧАСОВО: Створюємо подію в Calendar одразу (без очікування webhook)
    // В production webhook оновить статус
    try {
      const { google } = require('googleapis');
      
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

      const startTime = new Date(bookingData.selectedSlot);
      const endTime = new Date(startTime.getTime() + 120 * 60000); // 2 години

      const event = {
        summary: `📸 Фотосесія: ${bookingData.sessionType}`,
        description: `Клієнт: ${bookingData.name}\nEmail: ${bookingData.email}\nТелефон: ${bookingData.phone || 'не вказано'}\nНотатки: ${bookingData.note || 'немає'}\n\n⏰ Тривалість: ~1.5 години\n📍 Заблоковано 2 години (включно з переїздом)`,
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

      console.log('✅ Google Calendar event created:', calendarResponse.data.id);
    } catch (calendarError) {
      console.error('❌ Failed to create calendar event:', calendarError);
    }

    // Зберігаємо бронювання в БД
    await prisma.booking.create({
      data: {
        invoiceId: invoiceResponse.invoiceId,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone || null,
        sessionType: bookingData.sessionType,
        selectedSlot: new Date(bookingData.selectedSlot),
        note: bookingData.note || null,
        status: 'pending',
        amount: amount,
      },
    });

    return NextResponse.json({
      success: true,
      invoiceId: invoiceResponse.invoiceId,
      pageUrl: invoiceResponse.pageUrl,
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
