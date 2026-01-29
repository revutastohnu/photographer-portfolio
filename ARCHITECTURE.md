# Project Structure & Architecture

## Overview

This is a modern, single-page photographer portfolio with integrated booking system. Built with performance, accessibility, and user experience as top priorities.

## Key Features

✨ **Portfolio Management**
- File-based content system (JSON)
- Automatic portfolio grid generation
- Tag filtering and date sorting
- Deep-linkable modal views

📅 **Booking System**
- Google Calendar API integration
- Real-time availability checking
- Multi-step booking flow
- Payment integration ready (placeholder)

🎨 **Design System**
- Minimalist editorial aesthetic
- Premium feel with slow animations
- Monochrome + single accent color
- Fully responsive

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 14+ (App Router) | Server & client rendering |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Animations** | Framer Motion | Smooth transitions |
| **Backend** | Next.js API Routes | Serverless functions |
| **Integration** | Google Calendar API | Availability & booking |
| **Deployment** | Vercel | Hosting & CDN |

## Directory Structure

```
photographer-portfolio/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── availability/         # Calendar availability
│   │   └── booking/              # Booking submission
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── Navbar.tsx                # Navigation (sticky)
│   ├── Hero.tsx                  # Hero section
│   ├── Section.tsx               # Animated section wrapper
│   ├── PortfolioGrid.tsx         # Portfolio grid with filters
│   ├── SetModal.tsx              # Photo set modal (A11y)
│   ├── About.tsx                 # About section
│   ├── BookingSection.tsx        # Booking flow controller
│   ├── AvailabilityPicker.tsx    # Time slot picker
│   ├── BookingForm.tsx           # Contact form
│   └── PaymentStep.tsx           # Payment placeholder
│
├── lib/                          # Utilities
│   ├── types.ts                  # TypeScript types
│   ├── content.ts                # Content loading
│   ├── calendar.ts               # Google Calendar
│   └── utils.ts                  # Helpers
│
├── content/                      # Portfolio content
│   └── sets/                     # Photo sets (JSON)
│       ├── portrait-session/
│       ├── wedding-editorial/
│       └── urban-portraits/
│
├── public/                       # Static assets
│   └── portfolio/                # Portfolio images
│       ├── portrait-session/
│       ├── wedding-editorial/
│       └── urban-portraits/
│
└── docs/                         # Documentation
    ├── README.md                 # Main documentation
    ├── QUICKSTART.md             # Quick start guide
    ├── DEPLOYMENT.md             # Deployment guide
    └── ARCHITECTURE.md           # This file
```

## Data Flow

### Portfolio Display

```
1. User visits homepage
   ↓
2. getAllPhotoSets() reads content/sets/**/set.json
   ↓
3. Sets rendered in PortfolioGrid with filters
   ↓
4. User clicks set → SetModal opens with deep link (?set=slug)
   ↓
5. Gallery displayed with smooth animations
```

### Booking Flow

```
1. User clicks "Book a session"
   ↓
2. AvailabilityPicker fetches /api/availability
   ↓
3. API calls Google Calendar FreeBusy API
   ↓
4. Available slots generated and displayed
   ↓
5. User selects slot + fills form
   ↓
6. POST to /api/booking
   ↓
7. Booking logged (ready for database/email integration)
   ↓
8. PaymentStep shown (placeholder)
```

## Key Components

### 1. Content System (`lib/content.ts`)

- Reads JSON files from `content/sets/`
- Exports `getAllPhotoSets()` and `getPhotoSetBySlug()`
- Automatically sorts by year
- Generates tag list

### 2. Calendar Integration (`lib/calendar.ts`)

- Uses Google Service Account authentication
- `getFreeBusy()`: Fetches busy slots from calendar
- `generateTimeSlots()`: Creates available slots
- Configurable working hours and slot duration

### 3. Animations (Framer Motion)

All animations use consistent easing:
```typescript
{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }
```

Types of animations:
- **Scroll reveals**: Fade + slight Y translation
- **Hover effects**: Subtle scale (1.01-1.05)
- **Modal transitions**: Scale + fade
- **Page loads**: Staggered entrance

### 4. Responsive Design

Breakpoints (Tailwind):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Mobile-first approach with progressive enhancement.

## API Routes

### `/api/availability`

**Method**: `GET`  
**Query Params**: `?days=21` (optional, default 21)

**Returns**:
```json
{
  "slots": [
    {
      "startISO": "2024-01-20T10:00:00.000Z",
      "endISO": "2024-01-20T11:30:00.000Z",
      "label": "Sat, Jan 20, 10:00 AM"
    }
  ]
}
```

### `/api/booking`

**Method**: `POST`  
**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+380123456789",
  "sessionType": "portrait",
  "selectedSlot": "2024-01-20T10:00:00.000Z",
  "note": "Optional note"
}
```

**Returns**:
```json
{
  "success": true,
  "message": "Booking request received",
  "bookingId": "temp-1234567890"
}
```

## Performance Optimizations

1. **Static Generation**: Homepage pre-rendered at build time
2. **Code Splitting**: Automatic via Next.js App Router
3. **Image Optimization**: `next/image` for lazy loading
4. **CSS Optimization**: Tailwind CSS purges unused styles
5. **Font Loading**: Self-hosted via `next/font` with `display: swap`

## Accessibility Features

- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Focus trap in modal
- ✅ Keyboard navigation (Tab, Escape)
- ✅ Focus indicators on all buttons
- ✅ Proper heading hierarchy
- ✅ Skip links (implicit via smooth scroll)

## Security

- Environment variables never exposed to client
- Service account for Google Calendar (no user auth needed)
- Input validation on all forms
- HTTPS enforced (Vercel default)
- No inline scripts (CSP-friendly)

## Future Enhancements

### Phase 2: Payment Integration

```typescript
// In /api/booking/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.create({
  amount: 1500, // ₴1,500
  currency: 'uah',
  metadata: { bookingId: booking.id }
});
```

### Phase 3: Email Notifications

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'bookings@yourdomain.com',
  to: data.email,
  subject: 'Booking Confirmation',
  html: bookingConfirmationTemplate(data)
});
```

### Phase 4: Database

```typescript
// Using Prisma with PostgreSQL
const booking = await prisma.booking.create({
  data: {
    name: data.name,
    email: data.email,
    // ...
  }
});
```

### Phase 5: CMS Integration

Replace JSON files with Sanity/Contentful for GUI content management.

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Type Checking**
   ```bash
   npm run type-check
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Test Production Build**
   ```bash
   npm run start
   ```

## Testing Strategy

Currently manual testing. Recommended additions:

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **Visual Tests**: Percy or Chromatic
- **Performance**: Lighthouse CI

## Monitoring Recommendations

- **Analytics**: Vercel Analytics or Plausible
- **Error Tracking**: Sentry
- **Uptime**: Vercel built-in or UptimeRobot
- **Performance**: Vercel Speed Insights

## Contributing

See issues for feature requests and bugs. PRs welcome!

## License

Private project. All rights reserved.

---

**Maintainer**: Elena Kovalenko  
**Version**: 1.0.0  
**Last Updated**: January 2024
