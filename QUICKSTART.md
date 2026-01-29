# Quick Start Guide

Get your photographer portfolio running in 5 minutes.

## 🚀 Step 1: Install

```bash
npm install
```

## 🔧 Step 2: Environment Variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

**For development/testing**, the placeholder values in `.env.local` will work (booking will show a message about calendar not being configured).

**For production**, follow the [Google Calendar Setup](README.md#google-calendar-setup) guide.

## 🎯 Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✨ Step 4: Customize Content

### Change Site Info

Edit `app/layout.tsx`:

```typescript
export const metadata = {
  title: "Your Name — Photography",
  description: "Your description",
};
```

### Update Hero Text

Edit `components/Hero.tsx` - change the headline and intro text.

### Add Your Photo Sets

1. Create a folder: `content/sets/my-new-set/`
2. Create `set.json`:

```json
{
  "slug": "my-new-set",
  "title": "My Set Title",
  "year": 2024,
  "location": "City",
  "tags": ["portrait", "outdoor"],
  "cover": "/portfolio/my-new-set/cover.jpg",
  "description": "Description of this set",
  "gallery": [
    "/portfolio/my-new-set/1.jpg",
    "/portfolio/my-new-set/2.jpg"
  ]
}
```

3. Add images to `public/portfolio/my-new-set/`
4. Restart dev server

### Update About Section

Edit `components/About.tsx` - change the bio text and facts.

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --background: #fafaf9;  /* Your background color */
  --foreground: #0a0a0a;  /* Your text color */
  --accent: #10b981;      /* Your accent color (CTA buttons) */
  --border: #e7e5e4;      /* Border color */
}
```

## 📦 Step 5: Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick Vercel Deploy**:

```bash
npm install -g vercel
vercel
```

Then add environment variables in Vercel dashboard.

## 🎨 Customization Checklist

- [ ] Update site metadata (`app/layout.tsx`)
- [ ] Change hero text (`components/Hero.tsx`)
- [ ] Update about section (`components/About.tsx`)
- [ ] Add your photo sets (`content/sets/`)
- [ ] Upload portfolio images (`public/portfolio/`)
- [ ] Customize colors (`app/globals.css`)
- [ ] Update footer links (`app/page.tsx`)
- [ ] Set up Google Calendar (optional but recommended)

## 🆘 Troubleshooting

### "No available slots" in booking

Either:
1. Google Calendar credentials aren't set up (it's optional for MVP)
2. All time slots are busy in your calendar
3. Check console for API errors

### Build fails

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port already in use

```bash
npm run dev -- -p 3001
```

## 📚 Next Steps

- Read the full [README.md](README.md)
- Set up [Google Calendar integration](README.md#google-calendar-setup)
- Deploy to [Vercel](DEPLOYMENT.md)
- Add payment integration (Stripe, etc.)

---

Need help? Check the README or open an issue.
