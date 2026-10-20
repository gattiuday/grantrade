# Gran Trade Inc. — Pages & Component Architecture

This document details the functional specifications, DOM hierarchy, and interactive contracts for all 5 page files and reusable UI components.

---

## 1. Page Files Overview

### 1. `index.html` (Home)
- **Role**: Primary brand gateway and digital showroom introduction.
- **Key Sections**:
  - `header.site-header`: Sticky navigation bar with live America/New_York yard status pill, saved slabs drawer trigger, and mobile menu button.
  - `section.hero`: High-impact editorial hero with punchy statement *"The slab is the statement."*, background imagery, primary CTAs (*"Browse the collections"*, *"Plan a warehouse visit"*), and 3-pillar metric counters (20+ Years, 1,000+ Customers, 6+ Stone families).
  - `section.featured-viewer`: Interactive 3-picture viewer showcasing Gran Trade's signature Aquamarine Quartzite in Slab view, 2.3x Close-up detail, and Installed view.
  - `section.slab-grid`: 4 curated feature slabs with instant favorite toggling.
  - `section.why`: 4-pillar wholesale value grid (*Acclaimed at the source*, *Fully customizable choice*, *Built to perform*, *Service you can call*).
  - `section.applied`: Split layout highlighting the journey from slab to space across fabricators, designers, and homeowners.
  - `section.yard-visit-strip`: Warehouse visit invitation with direct phone link.
  - `footer.site-footer`: Comprehensive footer with brand summary, explore links, stone family index, and physical yard contact details.

### 2. `about.html` (About Us)
- **Role**: Deep dive into the company's 20+ year history and wholesale distribution philosophy.
- **Key Sections**:
  - `about-hero`: Headline *"Premier surfaces, since 2003"* with subtitle emphasizing the Northeast tri-state corridor.
  - `specs-bar`: 3-metric highlight strip (Year 2003, 20+ Years in business, 1,000+ Partners).
  - `about-story-grid`: Detailed narrative covering direct quarry relationships across Italy, Brazil, India, Spain, Greece, and US domestic quarries, alongside container check-in procedures.
  - `why-grid`: The wholesale operational model (Direct quarry sourcing, deep consecutive bundles, indoor gantry staging, rapid tri-state delivery).
  - `trade-commitment`: Clear demarcation of wholesale duties (distributor supplies slabs; fabricators provide cut/install quotes).

### 3. `collections.html` (Collections Catalog)
- **Role**: Interactive stone sourcing engine and comprehensive catalog.
- **Key Sections**:
  - `section-head`: Catalog header and category description.
  - `featuredViewer`: Integrated 3-picture stone viewer synchronized with category tab selection.
  - `coll-tabs`: Horizontally scrollable category rail switching between All, Quartz, Granite, Marble, Quartzite, Monuments, Semi Precious, Soapstone, and Tile.
  - `filters-bar`: Multi-facet filter controls (Color, Stone Type, Surface Finish, Slab Thickness, Sort order).
  - `filter-meta-bar`: Live result counter (*"Showing 60 stone slabs"* / dynamic updates).
  - `slabGrid`: Responsive grid holding all 60 stone cards with high-fidelity images, category badges, material specs, and heart favorite buttons.
  - `slabEmpty`: Accessible zero-results empty state with quick *"Reset All Filters"* action.

### 4. `showroom.html` (Showroom & Slab Yard)
- **Role**: Guide for trade professionals and homeowners planning to walk the Carlstadt slab yard.
- **Key Sections**:
  - `showroom-intro`: Headline *"Come walk the yard"* explaining why viewing stone in person is essential.
  - `showroom-gallery`: Asymmetrical gallery layout featuring overhead gantry crane operations, upright slab bundles, backlit quartzite, and finished vignettes.
  - `yard-guide-grid`: 3-step visitor guide (Walk-ins welcomed, crane-assisted staging, physical tagging and 14-day bundle holds).
  - `bookmatching-split`: Comprehensive educational breakdown of consecutive bundle bookmatching (mirror-image A/B slab cutting for waterfall counters and feature walls).
  - `location-banner`: Direct driving and phone coordination strip.

### 5. `contact.html` (Contact & Yard Hours)
- **Role**: Location hub, live hours calculator, multi-line telephone directory, and wholesale inquiry intake.
- **Key Sections**:
  - `contact-split`: Two-column layout pairing warehouse facility information with the wholesale inquiry form.
  - `hoursTable`: Real-time weekly schedule table with live pulsing status pill and automatic row highlighting for current day.
  - `location-card`: Full address (178 Commerce Road, Carlstadt, NJ 07072) with transit proximity notes (NJ Turnpike Exit 16W, Route 3, Route 17) and Google Maps button.
  - `phone-list`: Main yard desk `(201) 438-1888`, direct desk lines `(201) 438-9339`, `(201) 438-8126`, `(201) 438-1898`, and email `sales.grantrade@gmail.com`.
  - `contact-form-card`: Specialized wholesale form capturing project scope, inquiry type (Slab Hold, Staging, Trade Account, Monument, General), and stone interest without deceptive quote language.

---

## 2. Reusable Component Specifications

### 1. Site Header & Brand Wordmark
- **Markup**: `<header class="site-header">`
- **Classes**: `.header-inner`, `.wordmark`, `.main-nav`, `.header-actions`
- **Behavior**: Sticky at `top: 0`, 14px backdrop blur, subtle bottom border. Contains responsive hamburger toggle at `< 768px`.

### 2. 3-Picture Stone Viewer (`.featured-viewer`)
- **Markup**:
  ```html
  <div id="featuredViewer" class="featured-viewer">
    <div class="fv-stage">
      <img src="..." alt="..." />
      <span class="fv-tag">Slab view</span>
    </div>
    <div class="fv-side">
      <span class="fv-cat">Exotic Quartzite</span>
      <h3 class="fv-name">Aquamarine Quartzite</h3>
      <p class="fv-desc">...</p>
      <div class="fv-opts">
        <button class="fv-opt" data-view="0" aria-pressed="true">Slab View</button>
        <button class="fv-opt" data-view="1" aria-pressed="false">Close-up Detail</button>
        <button class="fv-opt" data-view="2" aria-pressed="false">Installed View</button>
      </div>
    </div>
  </div>
  ```
- **Behavior**:
  - Managed by `js/viewer.js`.
  - Clicking `data-view="1"` toggles `.fv-zoom` on the stage image, triggering a smooth 2.3x scale transform centered on the stone's natural mineral texture.
  - Clicking `data-view="2"` swaps the image source to an architectural installation vignette.
  - Updates `aria-pressed` on buttons for screen reader clarity.

### 3. Product Slab Card (`.slab-card`)
- **Markup**:
  ```html
  <article class="slab-card" data-cat="quartzite" data-type="natural" data-color="blue green" data-finish="polished" data-thickness="2 3" data-name="Aquamarine Quartzite" data-meta="Exotic Quartzite · Brazil">
    <div class="sc-media">
      <span class="cat-badge">Quartzite</span>
      <button class="heart" type="button" aria-label="Save to favorites">
        <svg fill="none" stroke="currentColor" ...></svg>
      </button>
      <img src="..." alt="..." loading="lazy" />
    </div>
    <div class="sc-body">
      <h3 class="sc-title">Aquamarine Quartzite</h3>
      <div class="sc-meta">Exotic Quartzite · Brazil</div>
      <p class="sc-desc">...</p>
      <div class="sc-specs">
        <span class="spec-pill">2 cm · 3 cm</span>
        <span class="spec-pill">Polished</span>
      </div>
    </div>
  </article>
  ```
- **Behavior**:
  - Employs data attributes (`data-cat`, `data-type`, `data-color`, `data-finish`, `data-thickness`) for instantaneous, non-destructive filtering by `js/filters.js`.
  - Heart button toggles favorite state and syncs with `js/favorites.js`.

### 4. Live Yard Open-Now Indicator Pill (`.open-indicator`)
- **Markup**:
  ```html
  <div class="open-indicator">
    <span class="open-dot"></span>
    <span class="open-text">Checking yard hours...</span>
  </div>
  ```
- **Behavior**:
  - Evaluated against `America/New_York` timezone in `js/nav.js`.
  - Green pulsing dot when yard is open; amber static dot when closed.
  - Displays closing time when open (e.g., *"Yard open now · closes 6:00 PM ET"*), or next opening time when closed (e.g., *"Opens Monday at 8:00 AM ET"*).

### 5. Client-Side Favorites Drawer (`#favDrawer`)
- **Markup**: `<aside id="favDrawer" class="fav-drawer" hidden>` + `<div id="scrim" class="scrim">`
- **Behavior**:
  - Slides in from right using CSS transform `translateX(0)`.
  - Synchronizes with `localStorage` key `grantrade_saved_slabs`.
  - Clicking heart on any slab card updates drawer list and navigation counter badge.
  - Closes on scrim click, close button click, or Escape key press.
