# Gran Trade Inc. — 8-Stage Website Pipeline

This document details the complete end-to-end delivery pipeline for the Gran Trade Inc. website redesign:  
**`content → structure → design → build → data → QA → deploy → live`**

---

## Stage 1: Content
### Objective
Establish brand positioning, tone of voice, inventory taxonomy, and strictly authentic wholesale messaging before writing markup.

### Deliverables
- **Core Value Proposition**: *"The slab is the statement."* Established Gran Trade Inc. as a high-tier wholesale importer of natural and engineered stone slabs, tile, and monuments in Carlstadt, New Jersey (serving NJ, NY, CT, PA).
- **Tone & Voice**: Authoritative, stone-literate, transparent, and direct B2B wholesale tone. Speaks directly to fabricators, architects, and design professionals, while maintaining a welcoming posture toward homeowners walking the yard.
- **Strict "No Quote CTAs" Policy**: Wholesale stone distributors do not quote cut countertop jobs — fabricators do. Replaced all generic retail quote spam with authentic distributor actions:
  - *Permitted*: "Come walk the yard", "Check slab availability", "Plan a warehouse visit", "Call the yard: (201) 438-1888", "Hold a bundle", "Bring your fabricator".
  - *Forbidden*: "Get a free quote", "Request a quote", "Instant price estimate", "Price per sq ft calculator".
- **Inventory Taxonomy**: Defined 8 material families (`quartz`, `granite`, `marble`, `monuments`, `quartzite`, `semi`, `soapstone`, `tile`) with color classifications, finishes, thicknesses, and origins.

---

## Stage 2: Structure
### Objective
Architect a clean, modular multi-page static site with semantic HTML5 markup, accessible landmarks, and clear file differentiation by job.

### Deliverables
- **5 Independent Page Files**:
  1. `index.html`: High-impact landing page, hero value props, 3-picture viewer showcase, featured slabs, why-grid, live yard status banner.
  2. `about.html`: Heritage story (founded 2003), direct global quarry partnerships, container check-in workflow, tri-state delivery network.
  3. `collections.html`: Full inventory catalog, tabbed category rail, multi-facet filtering and sorting engine, live result counter.
  4. `showroom.html`: "Come Walk the Yard" visitor guide, warehouse photo gallery, overhead crane staging, bookmatching bundle explanation.
  5. `contact.html`: Real-time America/New_York live open-now status indicator, weekly hours table with active day highlight, multi-line phone directory, Google Maps link, wholesale inquiry form.
- **Accessibility Landmarks**: Semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` elements with descriptive ARIA attributes.

---

## Stage 3: Design
### Objective
Craft an elegant visual identity rooted in natural stone aesthetics with high-contrast typography, warm neutrals, and smooth micro-animations.

### Deliverables
- **Design Token System**:
  - *Color Palette*: Warm alabaster neutrals (`--bg: #f6f2ec`, `--bg-2: #efe9df`, `--surface: #fffdf8`), deep mineral ink (`--ink: #221d16`, `--ink-2: #4c453a`), warm bronze amber (`--accent: #8a5a26`), and deep slate teal (`--teal: #2f4f4e`).
  - *Full Dark Mode*: Comprehensive CSS custom properties configured for `@media (prefers-color-scheme: dark)`.
- **Typography**:
  - Heading Display: `Marcellus` (refined serif font evoking classical masonry, monuments, and Italian marble heritage).
  - Body & UI: `Archivo` (geometric, legible sans-serif font engineered for architectural clarity).
- **Micro-Animations & Visual Polish**:
  - Glassmorphic sticky header with backdrop blur.
  - Heart favorite toggle with spring bounce feedback.
  - 3-Picture stone viewer with smooth 2.3x macro texture zoom.
  - Live pulsing status dot for open yard hours.

---

## Stage 4: Build
### Objective
Implement the design cleanly with strict 5-way CSS and 5-way JS separation of concerns, eliminating complex build toolchains or fragile bundling dependencies.

### Deliverables
- **CSS Split 5 Ways**:
  1. `css/base.css`: Tokens, variables, typography, reset, base styles.
  2. `css/layout.css`: Header, nav, containers, drawer shells, footer.
  3. `css/components.css`: Slab cards, viewer, chips, filters, buttons, hours table.
  4. `css/pages.css`: Page-specific sections (hero, why, applied, gallery, contact split).
  5. `css/responsive.css`: Media queries, breakpoint contracts, mobile drawer, touch targets.
- **JS Split 5 Ways**:
  1. `js/nav.js`: Mobile menu drawer, active page detection, America/New_York live yard status.
  2. `js/tabs.js`: Stone family category switching, count updating, viewer synchronization.
  3. `js/filters.js`: Multi-facet filtering (color, type, finish, thickness), dynamic sorting, empty state.
  4. `js/viewer.js`: 3-picture stone viewer (slab view, close-up zoom, installed room view).
  5. `js/favorites.js`: Client-side persistent favorites (`localStorage`), heart sync, sliding drawer.

---

## Stage 5: Data
### Objective
Establish a single source of truth for all stone slabs, finishes, thicknesses, and imagery.

### Deliverables
- **`data/products.json`**:
  - Structured catalog database containing 60 stones across all 8 material families.
  - Schema captures: `id`, `name`, `category`, `categoryLabel`, `type`, `meta`, `colors`, `colorLabel`, `finishes`, `thicknesses`, `thicknessLabel`, `origin`, `application`, `description`, `featured`, `image`, and `inStock`.
  - Static HTML rendering on `collections.html` with client-side JavaScript hydration ensures zero layout shift, instant First Contentful Paint (FCP), and optimal SEO indexing.

---

## Stage 6: Quality Assurance (QA)
### Objective
Verify responsive fidelity, interactive functionality, timezone accuracy, and accessibility across devices.

### Deliverables
- **Cross-Browser & Device Testing**:
  - Mobile (iOS Safari, Android Chrome) at 360px, 390px, 414px.
  - Tablet (iPad Safari) at 768px, 820px, 1024px.
  - Desktop (Chrome, Safari, Firefox, Edge) at 1280px, 1440px, 1920px.
- **Timezone Verification**: Tested `js/nav.js` against America/New_York schedule boundaries (e.g. 7:59 AM vs 8:01 AM Mon-Fri, Saturday 2:01 PM closing, Sunday closed label).
- **Interactive Verification**:
  - Multi-facet filters: Combining category + color + finish + thickness correctly filters cards and updates the count badge.
  - Favorites: Saving stones persists across page navigation via `localStorage`, updates navigation badge counter, and syncs heart icons.
  - 3-Picture Viewer: Zoom transform functions smoothly without layout reflows.

---

## Stage 7: Deploy
### Objective
Deploy the production assets through either of the two enterprise deployment routes documented in `DEPLOYMENT.md`.

### Deliverables
- **Route 1: Git-Backed Static Hosting** (GitHub Pages / Cloudflare Pages / AWS S3 + CloudFront).
- **Route 2: Managed Serverless Platform** (Netlify / Vercel with serverless form processing).
- Custom apex domain DNS routing for `grantradeinc.com` and `www.grantradeinc.com`.
- Security headers and cache-control configuration.

---

## Stage 8: Live
### Objective
Maintain production uptime, monitor inquiry deliverability, and keep inventory up to date as new quarry containers arrive.

### Deliverables
- **Health Checks & Monitoring**: Automated SSL certificate renewal tracking and HTTP 200 uptime monitoring.
- **Inquiry Lead Routing**: Verification that contact form submissions route to `sales.grantrade@gmail.com`.
- **Inventory Updates**: Simple workflow to append newly arrived bundles into `data/products.json` and export slab photographs to `assets/images/products/`.
