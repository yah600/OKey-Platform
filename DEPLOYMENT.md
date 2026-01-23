# Deployment Guide

## Overview

This guide covers deploying the O'Key Platform to production. The application is a static React SPA that can be hosted on any static hosting service.

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Git for version control
- Production environment variables configured

## Build Process

### 1. Install Dependencies

```bash
npm ci --production=false
```

Use `npm ci` for reproducible builds (uses package-lock.json exactly).

### 2. Set Environment Variables

Create `.env.production`:

```bash
VITE_APP_NAME=O'Key Platform
VITE_APP_VERSION=2.0.0
VITE_API_BASE_URL=https://api.okey-platform.com
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_FEATURE_FLAG_DARK_MODE=true
VITE_FEATURE_FLAG_I18N=true
```

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js       # Main bundle (51.90 KB gzipped)
│   ├── react-vendor-[hash].js # React bundle (175.29 KB)
│   ├── form-vendor-[hash].js  # Form libraries (89.68 KB)
│   ├── chart-vendor-[hash].js # Charts (minimal)
│   ├── state-vendor-[hash].js # Zustand (minimal)
│   ├── ui-vendor-[hash].js    # UI libraries (19.53 KB)
│   ├── index-[hash].css       # Tailwind CSS (106.03 KB)
│   └── [route]-[hash].js      # Lazy-loaded routes
```

**Total bundle size**: ~951 KB (52% under 2MB target)
**Initial bundle**: ~51.90 KB gzipped

### 4. Test Production Build Locally

```bash
npm run preview
```

Opens local server on `http://localhost:4173` to test production build.

## Deployment Platforms

### Vercel (Recommended)

#### Automatic Deployment

1. **Connect GitHub Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Vercel auto-detects Vite configuration

2. **Configure Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

3. **Set Environment Variables**
   - Add all `VITE_*` variables in Vercel dashboard
   - Settings → Environment Variables

4. **Deploy**
   - Push to `main` branch triggers automatic deployment
   - Preview deployments on all PRs
   - Custom domains supported

#### Manual Deployment

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### Netlify

#### Automatic Deployment

1. **Connect GitHub Repository**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Authorize GitHub and select repo

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Site settings → Environment variables
   - Add all `VITE_*` variables

4. **Deploy**
   - Push to `main` triggers deployment
   - Branch deploys for testing

#### Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"
```

---

### Cloudflare Pages

1. **Connect GitHub**
   - Go to Cloudflare Pages dashboard
   - Connect GitHub repository

2. **Build Configuration**
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`

3. **Environment Variables**
   - Settings → Environment variables
   - Add production variables

**Benefits**:
- Global CDN (fastest performance)
- Free SSL
- Unlimited bandwidth
- DDoS protection

---

### AWS S3 + CloudFront

#### 1. Create S3 Bucket

```bash
aws s3 mb s3://okey-platform-frontend
```

#### 2. Configure Bucket for Static Hosting

```bash
aws s3 website s3://okey-platform-frontend --index-document index.html
```

#### 3. Upload Build

```bash
npm run build
aws s3 sync dist/ s3://okey-platform-frontend --delete
```

#### 4. Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name okey-platform-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

#### 5. Invalidate Cache on Deploy

```bash
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

**Automation** (`deploy.sh`):
```bash
#!/bin/bash
npm run build
aws s3 sync dist/ s3://okey-platform-frontend --delete
aws cloudfront create-invalidation --distribution-id E123456 --paths "/*"
```

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.okey-platform.com`)
3. Add DNS records provided by Vercel
4. SSL certificate auto-provisioned

### Netlify

1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS to point to Netlify
4. HTTPS auto-enabled

### Cloudflare Pages

1. Custom domains → Set up a domain
2. Add CNAME record in Cloudflare DNS
3. SSL/TLS auto-configured

---

## Environment Configuration

### Production Environment Variables

```bash
# Application
VITE_APP_NAME=O'Key Platform
VITE_APP_VERSION=2.0.0
VITE_ENV=production

# API Configuration
VITE_API_BASE_URL=https://api.okey-platform.com
VITE_API_TIMEOUT=30000

# Supabase (Backend)
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (Payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51K...

# Feature Flags
VITE_FEATURE_FLAG_DARK_MODE=true
VITE_FEATURE_FLAG_I18N=true
VITE_FEATURE_FLAG_ANALYTICS=true

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry (Error Tracking)
VITE_SENTRY_DSN=https://...@sentry.io/...
```

### Loading Environment Variables

Access in code:
```typescript
import { config } from '@/lib/config';

const apiUrl = config.api.baseUrl;
```

Never commit `.env.production` to Git! Use platform-specific environment variable management.

---

## Performance Optimization

### 1. Enable Compression

Most platforms (Vercel, Netlify, Cloudflare) enable gzip/brotli compression automatically.

**Verify compression**:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
# Should see: Content-Encoding: gzip
```

### 2. Configure Caching Headers

**For hashed assets** (`/assets/*-[hash].js`):
```
Cache-Control: public, max-age=31536000, immutable
```

**For index.html**:
```
Cache-Control: public, max-age=0, must-revalidate
```

### 3. Enable HTTP/2

All recommended platforms support HTTP/2 by default.

### 4. Optimize Images

Use CDN for images:
```typescript
const imageUrl = `https://cdn.okey-platform.com/properties/${propertyId}.webp`;
```

### 5. Lazy Load Routes

Already implemented via React.lazy() - each route is a separate chunk loaded on demand.

---

## Security Configuration

### 1. Content Security Policy (CSP)

Add CSP header:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.okey-platform.com https://yourproject.supabase.co;
```

**In Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; ..."
        }
      ]
    }
  ]
}
```

### 2. HTTPS Only

All platforms enforce HTTPS by default. Add redirect:

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "http://*"
  to = "https://:splat"
  status = 301
  force = true
```

### 3. Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Monitoring & Analytics

### 1. Google Analytics

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Sentry Error Tracking

Install:
```bash
npm install @sentry/react
```

Initialize in `main.tsx`:
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENV,
  tracesSampleRate: 1.0,
});
```

### 3. Web Vitals Monitoring

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to Google Analytics or custom endpoint
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --run

      - name: Build production bundle
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Preview Deployments

Deploy every PR for testing:

```yaml
name: Preview Deployment

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          # No --prod flag for preview
```

---

## Production Checklist

Before deploying to production, verify:

### Build & Performance
- [ ] `npm run build` succeeds with 0 errors
- [ ] `npm run build` produces no warnings
- [ ] Total bundle size < 2MB
- [ ] Initial bundle < 200KB gzipped
- [ ] All routes are lazy-loaded
- [ ] Lighthouse Performance score ≥ 90
- [ ] Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Code Quality
- [ ] `npm test` passes all tests
- [ ] Test coverage ≥ 80%
- [ ] TypeScript errors: 0
- [ ] ESLint errors: 0
- [ ] No `console.log` statements in production code
- [ ] No TODO comments unresolved

### Security
- [ ] All environment variables configured
- [ ] No sensitive data in code or localStorage
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Security headers set
- [ ] Dependencies updated (no critical vulnerabilities)

### Accessibility
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] All images have alt text
- [ ] All forms have labels
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast ratios meet WCAG 2.1 AA

### SEO
- [ ] Meta tags configured (`title`, `description`)
- [ ] Open Graph tags for social sharing
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Lighthouse SEO score ≥ 90

### Analytics & Monitoring
- [ ] Google Analytics configured
- [ ] Error tracking (Sentry) configured
- [ ] Web Vitals monitoring enabled
- [ ] Uptime monitoring configured

### Documentation
- [ ] README.md updated
- [ ] CHANGELOG.md updated with version
- [ ] Environment variables documented
- [ ] Deployment process documented

---

## Rollback Strategy

### Vercel

```bash
# List deployments
vercel list

# Promote previous deployment to production
vercel promote <deployment-url> --prod
```

### Netlify

Use web UI:
1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout previous tag
git checkout v1.9.0
npm run build
# Deploy manually
```

---

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite

# Try build again
npm run build
```

### Environment Variables Not Working

- Check variable names start with `VITE_`
- Restart dev server after adding variables
- Rebuild production bundle

### Routes Return 404

Configure server to redirect all routes to `index.html`:

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache** (`.htaccess`):
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Performance Issues

- Check bundle sizes: `npm run build`
- Analyze bundle: Install `rollup-plugin-visualizer`
- Enable compression
- Verify CDN caching
- Check network waterfall in DevTools

---

## Support & Resources

- **Vite Documentation**: https://vitejs.dev
- **Vercel Documentation**: https://vercel.com/docs
- **Netlify Documentation**: https://docs.netlify.com
- **React Router Documentation**: https://reactrouter.com
- **Performance Best Practices**: https://web.dev/fast

---

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
