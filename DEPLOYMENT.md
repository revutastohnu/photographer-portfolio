# Deployment Guide

## Deploy to Vercel (Recommended)

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   
   In Vercel dashboard, go to **Settings** → **Environment Variables**:
   
   ```
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_CALENDAR_ID=your-calendar@group.calendar.google.com
   ```
   
   **Important**: Make sure to keep the `\n` characters in `GOOGLE_PRIVATE_KEY`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a production URL (e.g., `your-site.vercel.app`)

### Custom Domain

1. Go to **Settings** → **Domains** in Vercel
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificates are automatically provisioned

## Alternative: Deploy to Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. Add environment variables in Netlify dashboard

## Alternative: Self-Hosted

### Using PM2

```bash
npm run build
pm2 start npm --name "photographer-portfolio" -- start
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t photographer-portfolio .
docker run -p 3000:3000 --env-file .env.local photographer-portfolio
```

## Post-Deployment Checklist

- ✅ Test booking flow with real Google Calendar
- ✅ Verify all environment variables are set
- ✅ Check mobile responsiveness
- ✅ Test portfolio grid filtering
- ✅ Verify modal navigation works
- ✅ Test form submissions
- ✅ Add custom domain (optional)
- ✅ Set up analytics (Google Analytics, Plausible, etc.)

## Performance Optimization

The site is already optimized with:
- Static generation where possible
- Automatic image optimization via Next.js
- Tailwind CSS for minimal CSS bundle
- Code splitting via Next.js App Router

For further optimization:
- Add actual images (replace placeholders)
- Configure CDN (Vercel does this automatically)
- Enable ISR (Incremental Static Regeneration) if needed

## Monitoring

Consider adding:
- **Vercel Analytics** (built-in)
- **Sentry** for error tracking
- **Plausible** or **Google Analytics** for visitor insights

## Security

- Environment variables are never exposed to the client
- Google Calendar API uses service account (secure)
- All forms validate input
- HTTPS enforced by default on Vercel
