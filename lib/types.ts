export interface PhotoSet {
  slug: string;
  title: string;
  year: number;
  location: string;
  tags: string[];
  cover: string;
  description: string;
  gallery: string[];
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  sessionType: string;
  selectedSlot: string;
  note?: string;
}

export interface TimeSlot {
  startISO: string;
  endISO: string;
  label: string;
}
