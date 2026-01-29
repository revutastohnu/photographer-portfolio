import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export function getCalendarClient() {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  return google.calendar({ version: 'v3', auth });
}

export async function getFreeBusy(
  calendarId: string,
  timeMin: string,
  timeMax: string
) {
  const calendar = getCalendarClient();

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    },
  });

  const busySlots = response.data.calendars?.[calendarId]?.busy || [];
  return busySlots;
}

interface TimeSlot {
  startISO: string;
  endISO: string;
  label: string;
}

export function generateTimeSlots(
  startDate: Date,
  endDate: Date,
  busySlots: Array<{ start: string; end: string }>,
  slotDurationMinutes = 120, // Блокуємо 2 години в календарі
  workingHours = { start: 9, end: 16 }
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const currentDate = new Date(startDate);
  
  const minBreakBetweenSlots = 60; // Мінімум 1 година між слотами

  while (currentDate < endDate) {
    // Skip weekends
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Generate slots for the day - кожну годину
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const slotStart = new Date(currentDate);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDurationMinutes);

      // Check if slot end exceeds working hours
      if (slotEnd.getHours() > workingHours.end || 
         (slotEnd.getHours() === workingHours.end && slotEnd.getMinutes() > 0)) {
        break;
      }

      // Check if slot conflicts with busy slots (з урахуванням 1 години перерви)
      const isConflict = busySlots.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        
        // Розширюємо зайнятий період на 1 годину з кожного боку
        const busyStartWithBuffer = new Date(busyStart);
        busyStartWithBuffer.setMinutes(busyStartWithBuffer.getMinutes() - minBreakBetweenSlots);
        
        const busyEndWithBuffer = new Date(busyEnd);
        busyEndWithBuffer.setMinutes(busyEndWithBuffer.getMinutes() + minBreakBetweenSlots);
        
        // Перевіряємо чи слот перетинається з розширеним зайнятим періодом
        // Слот конфліктує якщо:
        // 1. Починається до кінця зайнятого періоду (+ 1 год буфер)
        // 2. Закінчується після початку зайнятого періоду (- 1 год буфер)
        return (
          slotStart < busyEndWithBuffer && slotEnd > busyStartWithBuffer
        );
      });

      if (!isConflict) {
        slots.push({
          startISO: slotStart.toISOString(),
          endISO: slotEnd.toISOString(),
          label: formatSlotLabel(slotStart),
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}

function formatSlotLabel(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}
