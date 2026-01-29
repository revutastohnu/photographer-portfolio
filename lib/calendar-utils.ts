/**
 * Генерує Google Calendar URL для додавання події
 */
export function generateCalendarUrl(
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  location?: string
): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
    ...(location && { location }),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Генерує .ics файл для завантаження
 */
export function generateICSFile(
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  location?: string
): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alina Gnusina Photography//Booking//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startTime)}`,
    `DTEND:${formatDate(endTime)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    ...(location ? [`LOCATION:${location}`] : []),
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:EMAIL',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return ics;
}
