export interface PhotoSessionImage {
  id: string;
  url: string;
  fileName: string;
  alt: string | null;
  order: number;
  isCover: boolean;
}

export interface PhotoSession {
  id: string;
  slug: string;
  title: string;
  titleUk: string;
  year: number;
  location: string;
  locationUk: string;
  description: string | null;
  descriptionUk: string | null;
  tags: string[];
  order: number;
  isActive: boolean;
  images: PhotoSessionImage[];
}

// Backward compatibility - старий інтерфейс для існуючих компонентів
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
