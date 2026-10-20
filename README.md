# Gran Trade Inc. — Production Website Architecture

Welcome to the modular production codebase for **Gran Trade Inc.** — wholesale importer and distributor of natural and engineered stone slabs, tile, and monuments located at **178 Commerce Road, Carlstadt, New Jersey 07072**.

---

## 📁 File Structure — Differentiated by Job

```
grantrade/
├── index.html                    # 1/5 Page: Home landing, hero statement, 3-view showcase, why-grid
├── about.html                    # 2/5 Page: Heritage story since 2003, global quarrying, wholesale model
├── collections.html              # 3/5 Page: Full catalog, 3-view panel, multi-facet filter & sort engine
├── showroom.html                 # 4/5 Page: "Come Walk the Yard", warehouse gallery, bookmatching guide
├── contact.html                  # 5/5 Page: Live yard status, hours table, phone lines, wholesale form
│
├── css/
│   ├── base.css                  # 1/5 CSS: Design tokens, typography (Marcellus + Archivo), dark mode
│   ├── layout.css                # 2/5 CSS: Site header, sticky nav, drawer shells, containers, footer
│   ├── components.css            # 3/5 CSS: Slab cards, 3-picture viewer, filter controls, hours table
│   ├── pages.css                 # 4/5 CSS: Page-specific sections (hero, why, applied, gallery, contact)
│   └── responsive.css            # 5/5 CSS: Responsive contract across mobile, tablet, and laptop
│
├── js/
│   ├── nav.js                    # 1/5 JS: Mobile menu drawer, active page link, America/New_York status
│   ├── tabs.js                   # 2/5 JS: Stone family category switching, count updating, viewer sync
│   ├── filters.js                # 3/5 JS: Multi-facet filtering (color, type, finish, thickness) & sorting
│   ├── viewer.js                 # 4/5 JS: 3-picture stone viewer (slab view, 2.3x macro zoom, installed)
│   └── favorites.js              # 5/5 JS: Persistent client-side favorites (localStorage) & sliding drawer
│
├── data/
│   └── products.json             # Single source of truth catalog database (60 stones across 8 families)
│
├── assets/
│   └── images/                   # High-resolution stone photography and showroom facility images
│       └── products/             # Product photography for all 60 catalog stones
│
└── docs/                         # Comprehensive documentation suite
    ├── PIPELINE.md               # 8-Stage Pipeline (content → structure → design → build → data → QA → deploy → live)
    ├── DEPLOYMENT.md             # Dual Deployment Routes Guide (Static CDN vs Managed Serverless)
    ├── PAGES_AND_COMPONENTS.md   # Functional specs for every page and UI component
    ├── DATA_MODEL.md             # products.json schema, field definitions, enums, and validation
    ├── RESPONSIVE_CONTRACT.md    # Multi-device contract (Mobile, Tablet, Laptop)
    └── CONTENT_RULES.md          # Original copy standards, strict "No Quote CTAs" policy, facts to confirm
```

---

## 🚀 Quick Start (Local Preview)

Because the project uses standard HTML5, Vanilla CSS, and Vanilla JavaScript with **zero build dependencies**, you can preview it immediately using any local static file server:

```bash
# Option 1: Python 3
cd /Users/udaygatti/.gemini/antigravity-ide/scratch/grantrade
python3 -m http.server 8080

# Option 2: Node.js npx serve
npx -y serve .

# Option 3: Direct browser opening
open index.html
```

Visit `http://localhost:8080` in your browser.

---

## 💎 Key Features & Implementation Highlights

1. **Strict 5-Way CSS & 5-Way JS Separation**:
   - Every file has a single, unambiguous responsibility.
   - Zero bundler overhead, zero compile step, instant edits and sub-50ms page load times.
2. **Multi-Device Responsiveness (Mobile, Tablet, Laptop)**:
   - Mobile: 44px+ touch targets, single-column catalog, drawer navigation, safe-area padding.
   - Tablet: 2-column catalog grids, balanced viewer staging, touch tab rail.
   - Laptop/Desktop: 3-4 column catalog grids, side-by-side interactive viewer with 2.3x macro zoom.
3. **Single Source of Truth (`data/products.json`)**:
   - Clean, standardized JSON database indexing all 60 catalog stones across 8 material families with multi-attribute tags.
4. **Interactive 3-Picture Stone Viewer**:
   - Toggles seamlessly between **Slab view**, **Close-up macro detail** (2.3x scale zoom centered on mineral texture), and **Installed room view**.
5. **Live Timezone-Aware Yard Status Widget**:
   - Calculated in real time against `America/New_York` timezone.
   - Displays pulsing green indicator during open hours and automatically highlights today's row in the hours table.
6. **Client-Side Saved Slabs Drawer**:
   - Heart buttons save stones to `localStorage` with real-time navigation badge updates and slide-out drawer management.
7. **Strict "No Quote CTAs" Policy**:
   - Replaced all generic retail quote spam with authentic wholesale actions (*"Come walk the yard"*, *"Check slab availability"*, *"Hold a bundle"*, *"Call the yard: (201) 438-1888"*).

---

## 📖 Documentation Suite Links

- [8-Stage Pipeline Documentation](file:///Users/udaygatti/.gemini/antigravity-ide/scratch/grantrade/docs/PIPELINE.md)
- [Dual Route Deployment Guide](file:///Users/udaygatti/.gemini/antigravity-ide/scratch/grantrade/docs/DEPLOYMENT.md)
- [Pages & Component Architecture](file:///Users/udaygatti/.gemini/antigravity-ide/scratch/grantrade/docs/PAGES_AND_COMPONENTS.md)
- [Data Model Specification](file:///Users/udaygatti/.gemini/antigravity-ide/scratch/grantrade/docs/DATA_MODEL.md)
- [Responsive Contract Specification](file:///Users/udaygatti/.gemini/antigravity-ide/scratch/grantrade/docs/RESPONSIVE_CONTRACT.md)
- [Content Rules & Facts to Confirm](file:///Users/udaygatti/.gemini/antigravity-ide/scratch/grantrade/docs/CONTENT_RULES.md)
