import { NextRequest, NextResponse } from 'next/server';
import { getFreeBusy, generateTimeSlots } from '@/lib/calendar';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysAhead = parseInt(searchParams.get('days') || '21', 10);

    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Google Calendar is not configured. Please set up environment variables.' },
        { status: 500 }
      );
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Починаємо з завтра
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeMin = tomorrow.toISOString();
    const futureDate = new Date(tomorrow);
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const timeMax = futureDate.toISOString();

    const busySlots = await getFreeBusy(calendarId, timeMin, timeMax);

    const availableSlots = generateTimeSlots(
      tomorrow, // Починаємо з завтра
      futureDate,
      busySlots.map((slot: any) => ({
        start: slot.start,
        end: slot.end,
      })),
      90, // 90 хвилин (але в календарі блокується 120 хв)
      { start: 9, end: 17 } // 9:00 - 17:00 (щоб останній слот 15:00-17:00 влізав)
    );

    console.log(`Generated ${availableSlots.length} slots from ${tomorrow.toDateString()} to ${futureDate.toDateString()}`);
    console.log('First 3 slots:', availableSlots.slice(0, 3).map(s => ({ date: s.startISO.split('T')[0], time: s.label })));

    return NextResponse.json({ slots: availableSlots });
  } catch (error: any) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability', details: error.message },
      { status: 500 }
    );
  }
}
