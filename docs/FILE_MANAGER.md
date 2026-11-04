# Gran Trade Inc. — Open Source Web File Manager Guide

This documentation outlines the Open Source Web File Manager integrated into Gran Trade Inc., covering both the built-in client-side file manager application and popular self-hosted open-source alternatives.

---

## 1. Built-in Open Source Web File Manager

Gran Trade Inc. includes a modern, zero-dependency open-source web file manager tailored for stone wholesale yards, inventory managers, and fabricators.

### Access Points
- **Embedded Admin Explorer**: Open [`admin.html`](../admin.html) and select the **"Web File Manager"** tab in the sidebar.
- **Dedicated Fullscreen App**: Open [`filemanager.html`](../filemanager.html) directly in any web browser.
- **Passphrase**: `grantrade2026` (synchronized with Admin Portal credentials).

### Core Features
- **Hierarchical Directory Tree**: Seamlessly browse stone catalogs, photography assets, and data files across `/`, `/assets/images`, `/assets/images/stone-types`, `/data`, `/docs`, and `/uploads`.
- **Dual Presentation Views**:
  - **Grid View**: High-resolution thumbnail cards optimized for natural stone slabs and veining inspection.
  - **Detailed List View**: File format badges, exact byte counts, modification timestamps, and quick action menus.
- **Real-Time Instant Search**: Filter assets instantly across directories by stone name, lot number, or extension.
- **Drag-and-Drop Ingestion**: Drop single or batch image files directly into the browser to stage or upload to cloud storage.
- **Interactive File Inspector & Code Preview**:
  - Inspect stone slab photography at high resolution.
  - View and review structured data (`products.json`) and documentation (`.md`) within an integrated code editor.
  - One-click button to **"Copy Public URL / File Path"** ready to paste into the Stone Inventory Editor.
- **Client-Side Virtual File System (VFS)**: Fully operational in offline / static hosting environments (GitHub Pages, Netlify, Vercel) using `localStorage` persistence and object blob URLs.
- **Supabase Cloud Storage Sync**: Seamlessly syncs with Supabase Storage buckets (`stone-media`) when database credentials are configured in Database Settings.
- **Direct Website & Homepage Content Editing**:
  - **Visual Homepage Editor**: Click **"Edit Homepage"** in the toolbar to change every title, hero headline, lead text, 4 pillars of value, metrics, and showroom contact info through an intuitive tabbed form.
  - **Live In-Browser Code Editor**: Click `index.html`, `data/homepage.json`, or any CSS/JS file to edit source code directly with line-by-line inspection and a one-click **"💾 Save File"** button.
  - **Static HTML Export**: Download the fully customized static `index.html` with one click.

---

## 2. Component Architecture

```
grantrade/
├── filemanager.html       # Standalone full-screen file manager application
├── admin.html             # Embedded file manager pane (#paneMedia)
├── css/
│   └── filemanager.css    # Responsive explorer styling, split pane, and preview modal
├── js/
│   ├── filemanager.js     # GranTradeFileManager engine (VFS, search, preview, Supabase bridge)
│   ├── admin.js           # Admin portal controller and file manager initialization
│   └── supabase-client.js # Supabase Storage API integration
└── docs/
    └── FILE_MANAGER.md    # Architecture and open-source deployment recipes
```

### GranTradeFileManager JavaScript API
The file manager engine exposes a clean global API via `window.GranTradeFileManager`:

```javascript
// Initialize the file explorer with custom DOM targets
window.GranTradeFileManager.init({
  breadcrumbsId: "fmBreadcrumbs",
  fileGridId: "fmFileGrid",
  fileTableWrapId: "fmFileTableWrap",
  fileTableBodyId: "fmFileTableBody",
  sidebarTreeId: "fmSidebarTree",
  searchInputId: "fmSearchInput",
  viewGridBtnId: "fmViewGridBtn",
  viewListBtnId: "fmViewListBtn",
  fileInputId: "fmFileInput",
  dropOverlayId: "fmDropOverlay",
  mainPaneId: "fmMainPane",
  previewModalId: "fmPreviewModal"
});

// Programmatic directory navigation
window.GranTradeFileManager.setDirectory("/assets/images/stone-types");

// File actions
window.GranTradeFileManager.openPreview(fileId);
window.GranTradeFileManager.copyUrl(filePath);
window.GranTradeFileManager.downloadFile(fileId);
window.GranTradeFileManager.deleteFile(fileId);
window.GranTradeFileManager.createFolder();
window.GranTradeFileManager.triggerUpload();
```

---

## 3. Workflow: Adding New Stone Slab Photography

1. **Open File Manager**: Navigate to [`filemanager.html`](../filemanager.html) or the Admin Portal's **Web File Manager** tab.
2. **Navigate to Stone Folder**: Click on `/assets/images/stone-types` or `/assets/images`.
3. **Upload Photos**: Drag slab photos from your computer or click **"+ Upload Files"**.
4. **Copy Asset Path**: Click the file card or the **"Inspect"** button, then click **"Copy Public URL"** (e.g. `assets/images/stone-types/calacatta-gold-lot-4.jpg`).
5. **Attach to Slab Record**: Open the **Slab Inventory** tab in the Admin Portal, edit or create a slab, and paste the copied path into the **Image URL / File Path** field.

---

## 4. Editing Homepage Everything from the File Manager

You can modify every section, headline, description, image, and contact detail across the homepage directly through two complementary modes:

### Method A: The Visual Homepage Content Editor (Form-Based)
1. In the Web File Manager toolbar (or the Admin Portal's File Manager tab), click the gold **"Edit Homepage"** button.
2. A tabbed editor opens with 5 sections:
   - **Tab 1: Hero & Metrics**: Edit eyebrow tagline, main `<h1>` headline, lead paragraph, metric numbers (e.g. `20+`, `1,000+`), and background photo.
   - **Tab 2: Featured Slab**: Modify the 3D rotating showcase slab name, lot number, and image path.
   - **Tab 3: Why Gran Trade**: Customize all 4 value proposition cards (titles & descriptions).
   - **Tab 4: Fabrication & Audiences**: Customize pitches for Fabricators, Designers/Architects, and Homeowners.
   - **Tab 5: Yard Visit & Contact**: Update the warehouse banner text, Carlstadt address, phone number, and operating hours.
3. Click **"💾 Save & Apply to Homepage"**.
   - Changes are immediately applied live on [`index.html`](../index.html) via [`js/homepage-loader.js`](../js/homepage-loader.js).
   - Stored in [`data/homepage.json`](../data/homepage.json) and browser storage.
4. Click **"📥 Download index.html"** if you want to export an updated static HTML file.

### Method B: Direct Code & File Editing (In-Browser Inspector)
1. In the File Manager directory tree, navigate to `/` or `/data`.
2. Click **`index.html`** or **`data/homepage.json`**.
3. The File Inspector modal opens with full syntax-formatted code.
4. Make your edits directly in the code editor.
5. Click **"💾 Save File"** in the footer to commit changes.

---

## 5. Alternative Self-Hosted Open-Source File Managers

If you run Gran Trade on a dedicated VPS, private server, or containerized infrastructure, you can deploy any of these proven open-source web file managers alongside the static website:

### Option A: Filebrowser (Recommended Go Binary)
[Filebrowser](https://filebrowser.org) is a popular, lightweight single-binary web file manager written in Go.

- **GitHub**: [github.com/filebrowser/filebrowser](https://github.com/filebrowser/filebrowser)
- **Features**: User authentication, role-based permissions, file sharing links, custom branding, and image thumbnails.

#### Quick Start (Linux / macOS):
```bash
# 1. Install filebrowser
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash

# 2. Run pointing to the Gran Trade assets directory
filebrowser -r /path/to/grantrade/assets -p 8080 --address 0.0.0.0
```

#### Docker Deployment:
```bash
docker run -d \
  --name grantrade-filemanager \
  -v /path/to/grantrade/assets:/srv \
  -v /path/to/filebrowser.db:/database/filebrowser.db \
  -v /path/to/settings.json:/config/settings.json \
  -e PUID=$(id -u) \
  -e PGID=$(id -g) \
  -p 8080:80 \
  filebrowser/filebrowser
```

---

### Option B: Tiny File Manager (Single-File PHP)
[TinyFileManager](https://tinyfilemanager.github.io) is a simple, fast, and lightweight file manager stored in a single PHP file.

- **GitHub**: [github.com/prasathmani/tinyfilemanager](https://github.com/prasathmani/tinyfilemanager)
- **Ideal for**: Traditional Apache / Nginx / cPanel web hosting.

#### Quick Start:
```bash
# Download the single PHP file into an admin folder
mkdir -p /path/to/grantrade/admin/files
curl -o /path/to/grantrade/admin/files/index.php https://raw.githubusercontent.com/prasathmani/tinyfilemanager/master/tinyfilemanager.php
```
Access via `https://your-domain.com/admin/files/` (default credentials: `admin` / `admin@123`).

---

### Option C: Decap CMS (Open-Source Git-Backed Media Library)
[Decap CMS](https://decapcms.org) (formerly Netlify CMS) provides an open-source media library that commits uploaded files directly to your GitHub repository.

- **GitHub**: [github.com/decaporg/decap-cms](https://github.com/decaporg/decap-cms)
- **Ideal for**: Static sites hosted on GitHub Pages, Netlify, or Vercel.
- **Benefit**: Uploaded slab photos are version-controlled with Git and deployed automatically through CI/CD.

#### Configuration Snippet (`admin/config.yml`):
```yaml
backend:
  name: github
  repo: gattiuday/grantrade
  branch: main

media_folder: "assets/images/stone-types"
public_folder: "assets/images/stone-types"
```

---

### Option D: Supabase Storage Studio
Gran Trade Inc. includes native client support for [Supabase Storage](https://supabase.com/docs/guides/storage).

- **Features**: S3-compatible cloud object storage, automatic image resizing via CDN, Row Level Security (RLS) policies, and a web dashboard for managing stone media buckets.
- **Bucket Configuration**:
  1. Open your Supabase Dashboard &rarr; **Storage**.
  2. Create a public bucket named `stone-media`.
  3. Enter your Supabase Project URL and Anon Public Key in the Admin Portal **Database & Cloud Settings** tab.
  4. Uploaded photos are stored in the cloud with CDN-cached public URLs.

