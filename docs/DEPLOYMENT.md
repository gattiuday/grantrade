# Gran Trade Inc. — Dual Route Deployment Guide

This guide documents the two deployment routes for the Gran Trade Inc. website. Because the site is built with pure standards-based HTML5, modular Vanilla CSS, and lightweight Vanilla JavaScript, it requires **zero build step**, making deployment instantaneous, reliable, and cost-effective.

---

## Route Overview Comparison

| Capability | Route 1: Git-Backed Static CDN | Route 2: Managed Serverless Platform |
| :--- | :--- | :--- |
| **Primary Providers** | Cloudflare Pages / GitHub Pages / AWS S3 + CloudFront | Netlify / Vercel |
| **Build Command** | *None* (Deploy root or public directory) | *None* (Static publish directory: `.`) |
| **Form Handling** | External service (Formspree, Formkeep, or `mailto:`) | Native serverless form processing & email notifications |
| **Global CDN & Edge** | 300+ Edge locations, sub-30ms TTFB | Global edge CDN with automated image optimization |
| **SSL / HTTPS** | Automated Let's Encrypt / Cloudflare Universal SSL | Automated wildcard Let's Encrypt SSL |
| **Hosting Cost** | $0.00 / month (Free tier permanent) | $0.00 / month (Free tier permanent) |
| **Best Suited For** | Maximum speed, zero vendor lock-in, client-side simplicity | Native wholesale inquiry capture without external form API |

---

## Route 1: Git-Backed Static Deployment (Cloudflare Pages / GitHub Pages)

### Option A: Cloudflare Pages (Recommended for Route 1)
Cloudflare Pages provides world-class edge performance, automated Brotli compression, and zero maintenance.

#### 1. Repository Setup
Push the `grantrade` codebase to a GitHub or GitLab repository:
```bash
git init
git add .
git commit -m "feat: Gran Trade Inc production modular codebase"
git remote add origin https://github.com/your-org/grantrade.git
git push -u origin main
```

#### 2. Connect to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** &rarr; **Create Application** &rarr; **Pages** &rarr; **Connect to Git**.
2. Select your repository `grantrade`.
3. Set **Build settings**:
   - **Framework preset**: `None`
   - **Build command**: *(leave blank)*
   - **Build output directory**: `.` (or root)
4. Click **Save and Deploy**. Cloudflare will publish the site within 10 seconds.

#### 3. Custom Domain Configuration (`grantradeinc.com`)
1. In Cloudflare Pages, go to **Custom domains** &rarr; **Set up a domain**.
2. Enter `grantradeinc.com` and `www.grantradeinc.com`.
3. Cloudflare will automatically provision edge SSL certificates and configure DNS CNAME/ALIAS records.

#### 4. Cache & Header Rules (`_headers` file)
Create a `_headers` file in the root for optimal caching:
```http
# Cache static assets for 1 year
/css/*
  Cache-Control: public, max-age=31536000, immutable
/js/*
  Cache-Control: public, max-age=31536000, immutable
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache HTML pages with revalidation
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Security Headers
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

---

### Option B: GitHub Pages
1. Go to repository **Settings** &rarr; **Pages**.
2. Under **Build and deployment**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `root`
3. Enter custom domain `grantradeinc.com` under **Custom domain** and check **Enforce HTTPS**.
4. In your DNS registrar (e.g., GoDaddy, Namecheap), add these A records for `grantradeinc.com`:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

---

## Route 2: Managed Serverless Platform (Netlify / Vercel)

Route 2 is ideal if you want native backend handling for the Wholesale Inquiry Form on `contact.html` without paying for third-party form endpoints.

### Option A: Netlify (Recommended for Route 2)

#### 1. Configuration File (`netlify.toml`)
Place this `netlify.toml` file in the project root:
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### 2. Enable Native Form Processing
On `contact.html`, Netlify automatically intercepts standard HTML forms with zero server setup. Simply ensure the `<form>` tag includes the `data-netlify="true"` attribute:
```html
<form id="inquiryForm" name="wholesale-inquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="wholesale-inquiry" />
  <p class="visually-hidden">
    <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
  </p>
  <!-- Form fields -->
</form>
```

#### 3. Automatic Email Routing
In the Netlify dashboard under **Site settings** &rarr; **Forms** &rarr; **Form notifications**:
1. Add an email notification to `sales.grantrade@gmail.com`.
2. Subject line template: `[Gran Trade Inquiry] {{fullName}} - {{inquiryType}}`.
3. Inquiries from stone fabricators, contractors, and homeowners will be delivered straight to your inbox with zero server maintenance.

---

### Option B: Vercel

1. Install Vercel CLI or import repository directly from [vercel.com/new](https://vercel.com/new).
2. Set **Framework Preset**: `Other`.
3. Set **Root Directory**: `./`.
4. Deploy with one click.
5. In `vercel.json`:
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## Pre-Launch Deployment Checklist

- [ ] All 5 HTML page links point to valid relative paths (`index.html`, `about.html`, etc.).
- [ ] Open-Now America/New_York indicator displays accurately during current local hours.
- [ ] All phone links initiate dialer with `tel:2014381888`.
- [ ] Email link opens default mail client with `mailto:sales.grantrade@gmail.com`.
- [ ] Favorites drawer persists items added from collections to contact page.
- [ ] SSL certificate active and forcing HTTPS redirection.
- [ ] 404 error page redirects cleanly to `index.html`.
