# 🎯 Quick Reference Card

## 🚀 Essential Commands

```bash
npm run dev          # Start development (localhost:3000)
npm run build        # Build for production
npm start            # Run production build locally
npm run type-check   # Check TypeScript errors
```

## 📁 Key Files to Edit

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Site title, description, metadata |
| `components/Hero.tsx` | Hero headline & intro text |
| `components/About.tsx` | Your bio & facts |
| `app/page.tsx` | Footer links (email, social) |
| `app/globals.css` | Colors & design tokens |
| `.env.local` | Google Calendar credentials |

## 📸 Add a Photo Set

1. Create folder: `content/sets/my-set-name/`
2. Create `set.json`:
```json
{
  "slug": "my-set-name",
  "title": "My Set",
  "year": 2024,
  "location": "City",
  "tags": ["portrait"],
  "cover": "/portfolio/my-set-name/cover.jpg",
  "description": "Description here",
  "gallery": ["/portfolio/my-set-name/1.jpg"]
}
```
3. Add images to `public/portfolio/my-set-name/`
4. Restart server

## 🎨 Change Colors

Edit `app/globals.css`:
```css
:root {
  --background: #fafaf9;  /* Background */
  --foreground: #0a0a0a;  /* Text */
  --accent: #10b981;      /* Buttons */
  --border: #e7e5e4;      /* Borders */
}
```

## 🗓️ Google Calendar Setup (Quick)

1. [Google Cloud Console](https://console.cloud.google.com/) → Create project
2. Enable "Google Calendar API"
3. Create Service Account → Download JSON key
4. Create calendar in Google Calendar
5. Share calendar with service account email
6. Copy credentials to `.env.local`:
```bash
GOOGLE_CLIENT_EMAIL=...@....iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=...@group.calendar.google.com
```

## 🚢 Deploy to Vercel

```bash
# Option 1: CLI
vercel

# Option 2: GitHub
git push origin main
# Then import in Vercel dashboard
```

**Don't forget**: Add environment variables in Vercel settings!

## 🔧 Customization Cheat Sheet

### Change Photographer Name
- `app/layout.tsx` - metadata
- `components/Navbar.tsx` - logo/name

### Adjust Animation Speed
Search for `duration:` in components and change values:
- Fast: `0.3-0.4s`
- Normal: `0.6-0.8s`
- Slow: `1.0-1.2s`

### Change Working Hours (Booking)
Edit `lib/calendar.ts` - `generateTimeSlots()`:
```typescript
workingHours = { start: 10, end: 18 }  // 10 AM - 6 PM
```

### Change Session Duration
Edit `lib/calendar.ts`:
```typescript
slotDurationMinutes = 90  // 90-minute sessions
```

## 📞 Booking Flow

```
User clicks "Book a session"
  ↓
Selects time slot from calendar
  ↓
Fills form (name, email, session type)
  ↓
Submits → logged to console (MVP)
  ↓
Payment placeholder shown
```

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Build fails?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Calendar not working?**
- Check `.env.local` exists
- Verify credentials are correct
- Check service account has calendar access
- View browser console for errors

**Modal not opening?**
- Check `content/sets/` folder has sets
- Verify JSON is valid
- Check browser console

## 📚 Documentation

- 📖 [README.md](README.md) - Full docs
- 🚀 [QUICKSTART.md](QUICKSTART.md) - 5-min start
- 🚢 [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy guide
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Technical
- ✅ [BUILD_SUMMARY.md](BUILD_SUMMARY.md) - What's included

## 💡 Pro Tips

- ✅ Test locally before deploying
- ✅ Use `npm run type-check` often
- ✅ Keep animations slow & smooth
- ✅ Optimize images before uploading
- ✅ Test on mobile devices
- ✅ Set up Google Calendar early

## 🎨 Design Principles

1. **Less is more** - Minimal elements
2. **Whitespace** - Generous spacing
3. **Slow animations** - Premium feel
4. **Typography** - Large, clear hierarchy
5. **Neutral colors** - Monochrome + accent

---

**Need more help?** Check the full documentation files or open an issue.

Keep this file handy for quick reference! 📌
