/**
 * GRAN TRADE INC. — OPEN SOURCE WEB FILE MANAGER ENGINE
 * Lightweight, self-contained client-side web file manager with Supabase Storage sync,
 * code/content editor, and direct Homepage Content Management.
 */

(function (global) {
  "use strict";

  // Initial Built-in Website Asset & Code Manifest
  const DEFAULT_FILES = [
    // Web Pages (Directly editable from File Manager)
    { id: "f_index", name: "index.html", path: "/", size: 54120, type: "text/html", url: "index.html", modified: "2026-11-10" },
    { id: "f_about", name: "about.html", path: "/", size: 13046, type: "text/html", url: "about.html", modified: "2026-11-10" },
    { id: "f_colls", name: "collections.html", path: "/", size: 24604, type: "text/html", url: "collections.html", modified: "2026-11-10" },
    { id: "f_slab", name: "slab.html", path: "/", size: 32500, type: "text/html", url: "slab.html", modified: "2026-11-10" },
    { id: "f_show", name: "showroom.html", path: "/", size: 10809, type: "text/html", url: "showroom.html", modified: "2026-11-10" },
    { id: "f_contact", name: "contact.html", path: "/", size: 22629, type: "text/html", url: "contact.html", modified: "2026-11-10" },
    { id: "f_admin", name: "admin.html", path: "/", size: 26174, type: "text/html", url: "admin.html", modified: "2026-11-10" },
    { id: "f_fm", name: "filemanager.html", path: "/", size: 19500, type: "text/html", url: "filemanager.html", modified: "2026-11-10" },

    // Data Files
    { id: "f_hp_json", name: "homepage.json", path: "/data", size: 4120, type: "application/json", url: "data/homepage.json", modified: "2026-11-10" },
    { id: "f14", name: "products.json", path: "/data", size: 42662, type: "application/json", url: "data/products.json", modified: "2026-11-10" },

    // Stylesheets
    { id: "f_css_base", name: "base.css", path: "/css", size: 7600, type: "text/css", url: "css/base.css", modified: "2026-11-10" },
    { id: "f_css_layout", name: "layout.css", path: "/css", size: 9200, type: "text/css", url: "css/layout.css", modified: "2026-11-10" },
    { id: "f_css_components", name: "components.css", path: "/css", size: 14500, type: "text/css", url: "css/components.css", modified: "2026-11-10" },
    { id: "f_css_pages", name: "pages.css", path: "/css", size: 18400, type: "text/css", url: "css/pages.css", modified: "2026-11-10" },
    { id: "f_css_responsive", name: "responsive.css", path: "/css", size: 14200, type: "text/css", url: "css/responsive.css", modified: "2026-11-10" },
    { id: "f_css_admin", name: "admin.css", path: "/css", size: 9800, type: "text/css", url: "css/admin.css", modified: "2026-11-10" },
    { id: "f_css_fm", name: "filemanager.css", path: "/css", size: 14200, type: "text/css", url: "css/filemanager.css", modified: "2026-11-10" },

    // Core Scripts
    { id: "f_js_catalog", name: "stone-catalog-data.js", path: "/js", size: 48200, type: "application/javascript", url: "js/stone-catalog-data.js", modified: "2026-11-10" },
    { id: "f_js_filters", name: "filters.js", path: "/js", size: 28400, type: "application/javascript", url: "js/filters.js", modified: "2026-11-10" },
    { id: "f_js_tabs", name: "tabs.js", path: "/js", size: 2600, type: "application/javascript", url: "js/tabs.js", modified: "2026-11-10" },
    { id: "f_js_slab", name: "slab-detail.js", path: "/js", size: 22100, type: "application/javascript", url: "js/slab-detail.js", modified: "2026-11-10" },
    { id: "f_js_hp", name: "homepage-loader.js", path: "/js", size: 3800, type: "application/javascript", url: "js/homepage-loader.js", modified: "2026-11-10" },
    { id: "f_js_types", name: "stone-types.js", path: "/js", size: 9400, type: "application/javascript", url: "js/stone-types.js", modified: "2026-11-10" },
    { id: "f_js_viewer", name: "viewer.js", path: "/js", size: 5800, type: "application/javascript", url: "js/viewer.js", modified: "2026-11-10" },
    { id: "f_js_fav", name: "favorites.js", path: "/js", size: 7100, type: "application/javascript", url: "js/favorites.js", modified: "2026-11-10" },
    { id: "f_js_wp", name: "wp-compat.js", path: "/js", size: 3900, type: "application/javascript", url: "js/wp-compat.js", modified: "2026-11-10" },
    { id: "f_js_admin", name: "admin.js", path: "/js", size: 24600, type: "application/javascript", url: "js/admin.js", modified: "2026-11-10" },
    { id: "f_js_fm", name: "filemanager.js", path: "/js", size: 28800, type: "application/javascript", url: "js/filemanager.js", modified: "2026-11-10" },
    { id: "f_js_sb", name: "supabase-client.js", path: "/js", size: 9800, type: "application/javascript", url: "js/supabase-client.js", modified: "2026-11-10" },
    { id: "f_js_nav", name: "nav.js", path: "/js", size: 4200, type: "application/javascript", url: "js/nav.js", modified: "2026-11-10" },

    // Assets: Brand & Images
    { id: "f1", name: "aquamarine-slab-1.jpg", path: "/assets/images", size: 897579, type: "image/jpeg", url: "assets/images/aquamarine-slab-1.jpg", modified: "2026-11-03" },
    { id: "f2", name: "aquamarine-slab-2.jpg", path: "/assets/images", size: 857508, type: "image/jpeg", url: "assets/images/aquamarine-slab-2.jpg", modified: "2026-11-03" },
    { id: "f3", name: "logo.png", path: "/assets/images", size: 16524, type: "image/png", url: "assets/images/logo.png", modified: "2026-11-03" },
    { id: "f4", name: "logo-white.png", path: "/assets/images", size: 16534, type: "image/png", url: "assets/images/logo-white.png", modified: "2026-11-03" },
    { id: "f5", name: "logo.svg", path: "/assets/images", size: 4295, type: "image/svg+xml", url: "assets/images/logo.svg", modified: "2026-11-03" },
    { id: "f6", name: "granite.jpg", path: "/assets/images/stone-types", size: 861585, type: "image/jpeg", url: "assets/images/stone-types/granite.jpg", modified: "2026-11-03" },
    { id: "f7", name: "marble.jpg", path: "/assets/images/stone-types", size: 640478, type: "image/jpeg", url: "assets/images/stone-types/marble.jpg", modified: "2026-11-03" },
    { id: "f8", name: "quartzite.jpg", path: "/assets/images/stone-types", size: 857508, type: "image/jpeg", url: "assets/images/stone-types/quartzite.jpg", modified: "2026-11-03" },
    { id: "f9", name: "quartz.jpg", path: "/assets/images/stone-types", size: 564613, type: "image/jpeg", url: "assets/images/stone-types/quartz.jpg", modified: "2026-11-03" },
    { id: "f10", name: "monuments.jpg", path: "/assets/images/stone-types", size: 976651, type: "image/jpeg", url: "assets/images/stone-types/monuments.jpg", modified: "2026-11-03" },
    { id: "f11", name: "semi-precious.jpg", path: "/assets/images/stone-types", size: 919719, type: "image/jpeg", url: "assets/images/stone-types/semi-precious.jpg", modified: "2026-11-03" },
    { id: "f12", name: "soapstone.jpg", path: "/assets/images/stone-types", size: 680423, type: "image/jpeg", url: "assets/images/stone-types/soapstone.jpg", modified: "2026-11-03" },
    { id: "f13", name: "tile.jpg", path: "/assets/images/stone-types", size: 891973, type: "image/jpeg", url: "assets/images/stone-types/tile.jpg", modified: "2026-11-03" },

    // Documentation
    { id: "f15", name: "DEPLOYMENT.md", path: "/docs", size: 6800, type: "text/markdown", url: "docs/DEPLOYMENT.md", modified: "2026-11-03" },
    { id: "f16", name: "FILE_MANAGER.md", path: "/docs", size: 9200, type: "text/markdown", url: "docs/FILE_MANAGER.md", modified: "2026-11-03" },
    { id: "f17", name: "WORDPRESS.md", path: "/docs", size: 5400, type: "text/markdown", url: "docs/WORDPRESS.md", modified: "2026-11-10" }
  ];

  const STORAGE_KEY = "grantrade_fm_files";
  const DIRECTORIES_KEY = "grantrade_fm_dirs";
  const HOMEPAGE_STORAGE_KEY = "grantrade_homepage_content";
  const FM_STATE_KEY = "grantrade_fm_ui_state";
  const BASE_DIRS = ["/", "/assets/images", "/assets/images/stone-types", "/data", "/css", "/js", "/docs", "/uploads"];

  let files = [];
  let customDirs = [...BASE_DIRS];
  let currentDirectory = "/";
  let searchQuery = "";
  let viewMode = "grid"; // "grid" | "list"
  let currentPreviewFile = null;
  let isRefreshing = false;

  // DOM Elements Cache
  let breadcrumbsEl, fileGridEl, fileTableBodyEl, fileTableWrapEl, sidebarTreeEl;
  let searchInput, viewGridBtn, viewListBtn, fileInput, dropOverlay, refreshBtn;
  let previewModal, previewImg, previewEditor, previewTitle, previewMeta, previewDownloadBtn, previewCopyBtn, previewSaveBtn;
  let totalFilesStatEl, totalSizeStatEl;
  let sidebarEl, sidebarToggleBtn, sidebarScrimEl;

  // Homepage Editor Modal Elements
  let homepageModal;

  function loadUiState() {
    try {
      const raw = sessionStorage.getItem(FM_STATE_KEY);
      if (!raw) return;
      const st = JSON.parse(raw);
      if (st && typeof st.dir === "string" && customDirs.includes(st.dir)) {
        currentDirectory = st.dir;
      }
      if (st && (st.view === "grid" || st.view === "list")) {
        viewMode = st.view;
      }
      if (st && typeof st.search === "string") {
        searchQuery = st.search;
      }
    } catch (_) {}
  }

  function saveUiState() {
    try {
      sessionStorage.setItem(
        FM_STATE_KEY,
        JSON.stringify({ dir: currentDirectory, view: viewMode, search: searchQuery })
      );
    } catch (_) {}
  }

  function loadState() {
    const defaultById = new Map(DEFAULT_FILES.map((df) => [df.id, df]));
    try {
      const savedDirs = localStorage.getItem(DIRECTORIES_KEY);
      if (savedDirs) {
        const parsedDirs = JSON.parse(savedDirs);
        customDirs = Array.from(new Set([...BASE_DIRS, ...parsedDirs]));
      } else {
        customDirs = [...BASE_DIRS];
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const kept = [];
        const seenIds = new Set();

        parsed.forEach((entry) => {
          if (!entry || !entry.id) return;
          if (defaultById.has(entry.id)) {
            const def = defaultById.get(entry.id);
            kept.push(
              entry.dirty
                ? Object.assign({}, def, entry)
                : Object.assign({}, def, { content: undefined, dirty: false })
            );
            seenIds.add(entry.id);
          } else {
            // Skip orphaned temporary blob URLs from expired sessions
            if (typeof entry.url === "string" && entry.url.indexOf("blob:") === 0 && !entry.content) {
              return;
            }
            kept.push(entry);
            seenIds.add(entry.id);
          }
        });

        DEFAULT_FILES.forEach((df) => {
          if (!seenIds.has(df.id)) {
            kept.push(Object.assign({}, df));
          }
        });

        files = kept;
      } else {
        files = DEFAULT_FILES.map((df) => Object.assign({}, df));
      }
      saveState();
    } catch (_) {
      files = DEFAULT_FILES.map((df) => Object.assign({}, df));
      customDirs = [...BASE_DIRS];
    }
  }

  function saveState() {
    try {
      const serializableFiles = files.map((f) => {
        const isBuiltin = DEFAULT_FILES.some((df) => df.id === f.id);
        if (isBuiltin && !f.dirty) {
          const clone = Object.assign({}, f);
          delete clone.content;
          return clone;
        }
        return f;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableFiles));
      localStorage.setItem(DIRECTORIES_KEY, JSON.stringify(customDirs));
    } catch (_) {}
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function getFileIcon(type, name) {
    const ext = name.split(".").pop().toLowerCase();
    if (type.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) {
      return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>`;
    }
    if (ext === "json" || ext === "js" || ext === "html" || ext === "css") {
      return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>`;
    }
    return `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`;
  }

  function getFilteredFiles() {
    return files.filter((f) => {
      // Directory match
      const dirMatch = currentDirectory === "/" ? true : f.path === currentDirectory || f.path.startsWith(currentDirectory + "/");
      if (!dirMatch) return false;

      // Search match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q);
      }
      return true;
    });
  }

  function renderBreadcrumbs() {
    if (!breadcrumbsEl) return;
    const parts = currentDirectory === "/" ? ["/"] : ["/", ...currentDirectory.split("/").filter(Boolean)];
    
    let html = "";
    let accumulatedPath = "";

    parts.forEach((part, idx) => {
      if (idx === 0) {
        accumulatedPath = "/";
        const isActive = currentDirectory === "/";
        html += `<button type="button" class="fm-crumb-btn ${isActive ? 'active' : ''}" onclick="window.GranTradeFileManager.setDirectory('/')">Root</button>`;
      } else {
        accumulatedPath += `/${part}`;
        const targetPath = accumulatedPath;
        const isActive = currentDirectory === targetPath;
        html += `<span class="fm-crumb-sep">/</span><button type="button" class="fm-crumb-btn ${isActive ? 'active' : ''}" onclick="window.GranTradeFileManager.setDirectory('${targetPath}')">${part}</button>`;
      }
    });

    breadcrumbsEl.innerHTML = html;
  }

  function renderSidebarTree() {
    if (!sidebarTreeEl) return;
    const counts = {};
    customDirs.forEach((d) => (counts[d] = 0));
    
    files.forEach((f) => {
      customDirs.forEach((d) => {
        if (d === "/" || f.path === d || f.path.startsWith(d + "/")) {
          counts[d] = (counts[d] || 0) + 1;
        }
      });
    });

    sidebarTreeEl.innerHTML = customDirs
      .map((dir) => {
        const label = dir === "/" ? "All Website Files" : dir.replace(/^\//, "");
        const isActive = currentDirectory === dir;
        return `
          <li>
            <div class="fm-tree-item ${isActive ? 'active' : ''}" onclick="window.GranTradeFileManager.setDirectory('${dir}')">
              <span class="fm-tree-item-label">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <span>${label}</span>
              </span>
              <span class="fm-tree-badge">${counts[dir] || 0}</span>
            </div>
          </li>
        `;
      })
      .join("");
  }

  function renderStats() {
    if (totalFilesStatEl) totalFilesStatEl.textContent = `${files.length} Files`;
    if (totalSizeStatEl) {
      const totalBytes = files.reduce((acc, cur) => acc + (cur.size || 0), 0);
      totalSizeStatEl.textContent = formatBytes(totalBytes);
    }
  }

  function renderFiles() {
    renderBreadcrumbs();
    renderSidebarTree();
    renderStats();

    const filtered = getFilteredFiles();

    // Toggle Grid vs List container visibility
    if (viewMode === "grid") {
      if (fileGridEl) fileGridEl.style.display = "grid";
      if (fileTableWrapEl) fileTableWrapEl.style.display = "none";
      renderGridView(filtered);
    } else {
      if (fileGridEl) fileGridEl.style.display = "none";
      if (fileTableWrapEl) fileTableWrapEl.style.display = "block";
      renderListView(filtered);
    }
  }

  function renderGridView(items) {
    if (!fileGridEl) return;
    if (items.length === 0) {
      fileGridEl.innerHTML = `
        <div class="fm-empty-state">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          <div style="font-size:1.1rem; font-weight:600; color:var(--ink);">No files found in ${currentDirectory}</div>
          <p style="font-size:0.85rem; color:var(--muted); margin-top:0.25rem;">Drop files here or click "+ Upload Files" above.</p>
        </div>
      `;
      return;
    }

    fileGridEl.innerHTML = items
      .map((f) => {
        const isImg = f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);
        const thumbHtml = isImg
          ? `<img src="${f.url}" alt="${f.name}" class="fm-card-img" onerror="this.onerror=null; this.src='assets/images/stone-types/quartzite.jpg';" />`
          : `<div class="fm-card-icon-fallback">${getFileIcon(f.type, f.name)}</div>`;

        const isEditable = /\.(html|json|css|js|md|txt)$/i.test(f.name);

        return `
          <div class="fm-card" onclick="window.GranTradeFileManager.openPreview('${f.id}')">
            <div class="fm-card-thumb">${thumbHtml}</div>
            <div class="fm-card-body">
              <div class="fm-card-title" title="${f.name}">${f.name}</div>
              <div class="fm-card-meta">
                <span>${formatBytes(f.size)}</span>
                <span style="display:inline-flex; align-items:center; gap:0.2rem;">
                  ${isEditable ? '<span style="color:var(--accent); font-weight:700;">● Edit</span> · ' : ''}${f.path}
                </span>
              </div>
            </div>
            <div class="fm-card-actions" onclick="event.stopPropagation()">
              <button type="button" class="fm-action-btn" title="Inspect & Edit File" onclick="window.GranTradeFileManager.openPreview('${f.id}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button type="button" class="fm-action-btn" title="Copy Public URL" onclick="window.GranTradeFileManager.copyUrl('${f.url}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
              </button>
              <button type="button" class="fm-action-btn" title="Download File" onclick="window.GranTradeFileManager.downloadFile('${f.id}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              </button>
              <button type="button" class="fm-action-btn delete" title="Delete File" onclick="window.GranTradeFileManager.deleteFile('${f.id}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderListView(items) {
    if (!fileTableBodyEl) return;
    if (items.length === 0) {
      fileTableBodyEl.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:3rem; color:var(--muted);">No files found in directory.</td></tr>`;
      return;
    }

    fileTableBodyEl.innerHTML = items
      .map((f) => {
        const isImg = f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);
        const iconOrThumb = isImg
          ? `<img src="${f.url}" alt="${f.name}" class="fm-table-thumb" onerror="this.onerror=null; this.src='assets/images/stone-types/quartzite.jpg';" />`
          : `<div style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:var(--bg-2); border-radius:var(--radius-sm); border:1px solid var(--line); color:var(--muted);">${getFileIcon(f.type, f.name)}</div>`;

        return `
          <tr onclick="window.GranTradeFileManager.openPreview('${f.id}')" style="cursor:pointer;">
            <td>
              <div class="fm-table-file-cell">
                ${iconOrThumb}
                <div>
                  <div style="font-weight:600; color:var(--ink);">${f.name}</div>
                  <div style="font-size:0.75rem; color:var(--muted);">${f.path}</div>
                </div>
              </div>
            </td>
            <td><span class="fm-tree-badge">${f.type.split("/")[1] || f.name.split(".").pop()}</span></td>
            <td style="font-size:0.85rem; color:var(--ink-2);">${formatBytes(f.size)}</td>
            <td style="font-size:0.85rem; color:var(--muted);">${f.modified || "2026-11-03"}</td>
            <td style="text-align:right;" onclick="event.stopPropagation()">
              <button type="button" class="fm-action-btn" title="Inspect & Edit File" onclick="window.GranTradeFileManager.openPreview('${f.id}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button type="button" class="fm-action-btn" title="Copy URL" onclick="window.GranTradeFileManager.copyUrl('${f.url}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
              </button>
              <button type="button" class="fm-action-btn" title="Download" onclick="window.GranTradeFileManager.downloadFile('${f.id}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              </button>
              <button type="button" class="fm-action-btn delete" title="Delete" onclick="window.GranTradeFileManager.deleteFile('${f.id}')">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // ---------------- File Ingestion (Upload) ----------------
  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Read failed"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFilesUpload(fileList) {
    for (const file of Array.from(fileList)) {
      let publicUrl = "";

      // Try Supabase Storage sync if client configured
      if (window.GranTradeDB && window.GranTradeDB.isConnected()) {
        try {
          const res = await window.GranTradeDB.uploadMedia(file);
          publicUrl = res.publicUrl || res.url;
        } catch (e) {
          console.warn("Supabase upload fallback to local URL:", e);
        }
      }

      if (!publicUrl) {
        if (file.type.startsWith("image/") && file.size <= 2500000) {
          try {
            publicUrl = await readFileAsDataUrl(file);
          } catch (_) {
            publicUrl = URL.createObjectURL(file);
          }
        } else {
          publicUrl = URL.createObjectURL(file);
        }
      }

      let fileContent = "";
      if (file.type.startsWith("text/") || file.type.includes("json") || file.name.match(/\.(html|css|js|json|md)$/i)) {
        try {
          fileContent = await file.text();
        } catch (_) {}
      }

      const newFileObj = {
        id: "usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
        name: file.name,
        path: currentDirectory,
        size: file.size,
        type: file.type || "application/octet-stream",
        url: publicUrl,
        modified: new Date().toISOString().split("T")[0],
        content: fileContent,
        dirty: Boolean(fileContent)
      };

      files.unshift(newFileObj);
    }

    saveState();
    renderFiles();
  }

  // ---------------- Inspector & Code Preview ----------------
  function openPreview(fileId) {
    const f = files.find((x) => x.id === fileId);
    if (!f || !previewModal) return;
    currentPreviewFile = f;

    if (previewTitle) previewTitle.textContent = f.name;
    if (previewMeta) previewMeta.textContent = `${f.path} · ${formatBytes(f.size)} · ${f.type}`;

    const isImg = f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);
    if (isImg && previewImg) {
      previewImg.src = f.url;
      previewImg.style.display = "block";
      if (previewEditor) previewEditor.style.display = "none";
      if (previewSaveBtn) previewSaveBtn.style.display = "none";
    } else if (previewEditor) {
      if (previewImg) previewImg.style.display = "none";
      previewEditor.style.display = "block";
      if (previewSaveBtn) previewSaveBtn.style.display = "inline-flex";

      // If text content is not customized, always fetch latest live content
      if ((!f.dirty || !f.content) && f.url) {
        previewEditor.value = "/* Loading live file content... */";
        const bust = f.url.includes("?") ? `&_ts=${Date.now()}` : `?_ts=${Date.now()}`;
        fetch(f.url + bust, { cache: "no-store" })
          .then((r) => {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.text();
          })
          .then((text) => {
            f.content = text;
            f.size = new Blob([text]).size;
            previewEditor.value = text;
          })
          .catch(() => {
            previewEditor.value = f.content || `/* Binary or media file: ${f.name} */\n/* Size: ${formatBytes(f.size)} */`;
          });
      } else {
        previewEditor.value = f.content || "";
      }
    }

    previewModal.classList.add("active");
  }

  function closePreview() {
    if (previewModal) previewModal.classList.remove("active");
    currentPreviewFile = null;
  }

  function saveCurrentFile() {
    if (!currentPreviewFile || !previewEditor) return;
    const newContent = previewEditor.value;
    currentPreviewFile.content = newContent;
    currentPreviewFile.dirty = true;
    currentPreviewFile.size = new Blob([newContent]).size;
    currentPreviewFile.modified = new Date().toISOString().split("T")[0];

    // Special handlers for critical website files
    if (currentPreviewFile.name === "homepage.json") {
      try {
        const parsed = JSON.parse(newContent);
        localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(parsed));
        if (window.GranTradeHomepageLoader) {
          window.GranTradeHomepageLoader.apply(parsed);
        }
      } catch (err) {
        alert("JSON syntax error: " + err.message);
        return;
      }
    } else if (currentPreviewFile.name === "index.html") {
      localStorage.setItem("grantrade_vfs_index_html", newContent);
    }

    saveState();
    renderFiles();
    alert(`File "${currentPreviewFile.name}" saved successfully!\nUpdated size: ${formatBytes(currentPreviewFile.size)}`);
  }

  function copyUrl(url) {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      alert("Public asset URL copied to clipboard:\n" + url);
    }).catch(() => {
      prompt("Copy asset URL:", url);
    });
  }

  function downloadFile(fileId) {
    const f = files.find((x) => x.id === fileId);
    if (!f) return;

    // If text file was edited in memory, download from blob
    if (f.content) {
      const blob = new Blob([f.content], { type: f.type || "text/plain" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = f.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      return;
    }

    const a = document.createElement("a");
    a.href = f.url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function deleteFile(fileId) {
    const f = files.find((x) => x.id === fileId);
    if (!f) return;
    if (confirm(`Are you sure you want to delete ${f.name}?`)) {
      files = files.filter((x) => x.id !== fileId);
      saveState();
      renderFiles();
      closePreview();
    }
  }

  function createFolder() {
    const name = prompt("Enter new folder name (e.g. 'high-res-slabs', 'blueprints', 'receipts'):");
    if (!name) return;
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const newDir = currentDirectory === "/" ? `/${cleanName}` : `${currentDirectory}/${cleanName}`;
    if (!customDirs.includes(newDir)) {
      customDirs.push(newDir);
      saveState();
      renderSidebarTree();
      window.GranTradeFileManager.setDirectory(newDir);
    }
  }

  // ---------------- Visual Homepage Content Editor ----------------
  async function openHomepageEditor() {
    homepageModal = document.getElementById("fmHomepageModal");
    if (!homepageModal) return;

    let hpData = null;

    // Check localStorage first
    try {
      const local = localStorage.getItem(HOMEPAGE_STORAGE_KEY);
      if (local) hpData = JSON.parse(local);
    } catch (_) {}

    // Fallback to homepage.json in files or fetch
    if (!hpData) {
      const f = files.find((x) => x.name === "homepage.json");
      if (f && f.content) {
        try { hpData = JSON.parse(f.content); } catch (_) {}
      }
    }

    if (!hpData) {
      try {
        const res = await fetch("data/homepage.json");
        if (res.ok) hpData = await res.json();
      } catch (_) {}
    }

    hpData = hpData || {};

    // Helper to safely set input values
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : "";
    };

    // Hero Section
    setVal("hpEditHeroTag", hpData.hero?.tag || "Wholesale Warehouse & Slab Display · Carlstadt, NJ");
    setVal("hpEditHeroTitle", hpData.hero?.title || "The slab is the statement.");
    setVal("hpEditHeroLead", hpData.hero?.lead || "A premier distributor of architectural stones. Gran Trade imports natural quartzite, fine marble, durable granite, and engineered quartz from trusted quarries worldwide, stocked and ready at our Carlstadt, New Jersey warehouse.");
    setVal("hpEditMetric1Val", hpData.hero?.metric1Val || "20+");
    setVal("hpEditMetric1Lbl", hpData.hero?.metric1Lbl || "Years importing stone");
    setVal("hpEditMetric2Val", hpData.hero?.metric2Val || "1,000+");
    setVal("hpEditMetric2Lbl", hpData.hero?.metric2Lbl || "Trade customers served");
    setVal("hpEditHeroBg", hpData.hero?.bgImage || "assets/images/stone-types/granite.jpg");

    // Featured Slab
    setVal("hpEditSlabTitle", hpData.featuredSlab?.title || "Aquamarine Quartzite");
    setVal("hpEditSlabSub", hpData.featuredSlab?.sub || "LOT #59108 · 3 cm");
    setVal("hpEditSlabImage", hpData.featuredSlab?.image || "assets/images/aquamarine-slab-1.jpg");

    // Why Gran Trade (4 Pillars)
    const cards = hpData.whyGranTrade?.cards || [];
    setVal("hpEditWhy1Title", cards[0]?.title || "Acclaimed at the source");
    setVal("hpEditWhy1Desc", cards[0]?.desc || "Our products come from premier global quarries widely acclaimed for slab clarity. Every ocean container is inspected at our Carlstadt warehouse upon arrival.");
    setVal("hpEditWhy2Title", cards[1]?.title || "Fully customizable choice");
    setVal("hpEditWhy2Desc", cards[1]?.desc || "Pick from 60+ curated natural and engineered stone options — a range tailored to diverse architectural styles, high-traffic commercial spaces, and custom homes.");
    setVal("hpEditWhy3Title", cards[2]?.title || "Built to perform");
    setVal("hpEditWhy3Desc", cards[2]?.desc || "Durable, cleanable, high-grade stone stocked deep in consecutive bundles so your fabricator can match veins and fulfill multi-room project requirements without batch variations.");
    setVal("hpEditWhy4Title", cards[3]?.title || "Service you can call");
    setVal("hpEditWhy4Desc", cards[3]?.desc || "We take pride in our direct customer relations. Real stone specialists answer our phones, know the current rack locations, and coordinate seamless delivery logistics.");

    // Applied / Fabrication
    setVal("hpEditAppTitle", hpData.applied?.title || "Where our stone ends up");
    setVal("hpEditAppLead", hpData.applied?.lead || "Most of what leaves our Carlstadt facility is fabricated within the tri-state area — kitchens, master baths, hotel lobbies, restaurant bars, and monumental memorials.");
    setVal("hpEditAppFab", hpData.applied?.fabricatorsDesc || "Consistent slab thickness, true calibration, and verified resin quality slab after slab.");
    setVal("hpEditAppDes", hpData.applied?.designersDesc || "Bookmatch sequential slabs from the same geological block for waterfall islands and full-height backsplashes.");
    setVal("hpEditAppHome", hpData.applied?.homeownersDesc || "You are welcome to walk the warehouse and tag your dream slab in person — bring your fabricator or borrow ours.");

    // Yard Visit & Contact
    setVal("hpEditYardTitle", hpData.yardCta?.title || "Come walk the slab yard");
    setVal("hpEditYardDesc", hpData.yardCta?.desc || "Photos sell stone short. Visit our 178 Commerce Road warehouse to see full slabs under natural and overhead staging light. No appointment needed during open hours.");
    setVal("hpEditPhone", hpData.contact?.phone || "(201) 438-1888");
    setVal("hpEditEmail", hpData.contact?.email || "sales.grantrade@gmail.com");
    setVal("hpEditAddress", hpData.contact?.address || "178 Commerce Road, Carlstadt, New Jersey 07072");
    setVal("hpEditHoursWk", hpData.contact?.hoursWeekday || "Monday – Friday: 8:00 AM – 5:00 PM");
    setVal("hpEditHoursSat", hpData.contact?.hoursSaturday || "Saturday: 8:00 AM – 1:00 PM");

    // Setup Tabs
    const tabs = homepageModal.querySelectorAll(".fm-hp-tab");
    const panes = homepageModal.querySelectorAll(".fm-hp-pane");
    tabs.forEach((tab) => {
      tab.onclick = function () {
        tabs.forEach((t) => t.classList.remove("active"));
        panes.forEach((p) => (p.style.display = "none"));
        this.classList.add("active");
        const targetPane = document.getElementById(this.getAttribute("data-tab"));
        if (targetPane) targetPane.style.display = "flex";
      };
    });

    homepageModal.classList.add("active");
  }

  function closeHomepageEditor() {
    if (homepageModal) homepageModal.classList.remove("active");
  }

  function saveHomepageContent() {
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    const hpData = {
      hero: {
        tag: getVal("hpEditHeroTag"),
        title: getVal("hpEditHeroTitle"),
        lead: getVal("hpEditHeroLead"),
        bgImage: getVal("hpEditHeroBg") || "assets/images/stone-types/granite.jpg",
        metric1Val: getVal("hpEditMetric1Val"),
        metric1Lbl: getVal("hpEditMetric1Lbl"),
        metric2Val: getVal("hpEditMetric2Val"),
        metric2Lbl: getVal("hpEditMetric2Lbl")
      },
      featuredSlab: {
        title: getVal("hpEditSlabTitle"),
        sub: getVal("hpEditSlabSub"),
        image: getVal("hpEditSlabImage") || "assets/images/aquamarine-slab-1.jpg",
        link: "slab.html?id=aquamarine-quartzite"
      },
      taxonomyHead: {
        eyebrow: "Wholesale Material Taxonomy",
        title: "The Types of Stone We Carry",
        lead: "Direct from premier quarries across Brazil, Italy, India, and the United States to our Carlstadt, NJ warehouse. Scroll down through our vertical liquid flow catalog to inspect geological formation, natural veining, and architectural applications."
      },
      whyGranTrade: {
        eyebrow: "The Wholesale Advantage",
        title: "Built for the trade, open to everyone",
        lead: "We work directly with quarries to provide Northeast fabricators, designers, and project managers with unmatched inventory reliability.",
        cards: [
          { num: "01", title: getVal("hpEditWhy1Title"), desc: getVal("hpEditWhy1Desc") },
          { num: "02", title: getVal("hpEditWhy2Title"), desc: getVal("hpEditWhy2Desc") },
          { num: "03", title: getVal("hpEditWhy3Title"), desc: getVal("hpEditWhy3Desc") },
          { num: "04", title: getVal("hpEditWhy4Title"), desc: getVal("hpEditWhy4Desc") }
        ]
      },
      applied: {
        eyebrow: "From Slab to Space",
        title: getVal("hpEditAppTitle"),
        lead: getVal("hpEditAppLead"),
        image: "assets/images/aquamarine-slab-2.jpg",
        fabricatorsDesc: getVal("hpEditAppFab"),
        designersDesc: getVal("hpEditAppDes"),
        homeownersDesc: getVal("hpEditAppHome")
      },
      yardCta: {
        eyebrow: "Visit Carlstadt, NJ",
        title: getVal("hpEditYardTitle"),
        desc: getVal("hpEditYardDesc"),
        phone: getVal("hpEditPhone")
      },
      contact: {
        address: getVal("hpEditAddress"),
        phone: getVal("hpEditPhone"),
        email: getVal("hpEditEmail"),
        hoursWeekday: getVal("hpEditHoursWk"),
        hoursSaturday: getVal("hpEditHoursSat"),
        hoursSunday: "Sunday: Closed"
      }
    };

    // 1. Save to local storage for live updates
    const jsonStr = JSON.stringify(hpData, null, 2);
    localStorage.setItem(HOMEPAGE_STORAGE_KEY, jsonStr);

    // 2. Update Virtual File System homepage.json
    const hpFile = files.find((f) => f.name === "homepage.json");
    if (hpFile) {
      hpFile.content = jsonStr;
      hpFile.size = new Blob([jsonStr]).size;
      hpFile.modified = new Date().toISOString().split("T")[0];
    }
    saveState();
    renderFiles();

    // 3. Apply to live homepage if loader is present
    if (window.GranTradeHomepageLoader) {
      window.GranTradeHomepageLoader.apply(hpData);
    }

    alert("Homepage content updated successfully!\nAll changes are now active on index.html and stored in data/homepage.json.");
    closeHomepageEditor();
  }

  async function downloadUpdatedIndexHtml() {
    let htmlContent = "";

    // Check if we have cached index.html
    const indexFile = files.find((f) => f.name === "index.html");
    if (indexFile && indexFile.content) {
      htmlContent = indexFile.content;
    } else {
      try {
        const res = await fetch("index.html");
        if (res.ok) htmlContent = await res.text();
      } catch (_) {}
    }

    if (!htmlContent) {
      alert("Unable to load index.html template for export.");
      return;
    }

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function scrollFmTop() {
    try {
      const htmlEl = document.documentElement;
      const prevBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      htmlEl.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      const mainPane = document.getElementById("fmMainPane");
      if (mainPane) mainPane.scrollTop = 0;
      htmlEl.style.scrollBehavior = prevBehavior;
    } catch (_) {}
  }

  if (typeof global.history !== "undefined" && "scrollRestoration" in global.history) {
    try {
      global.history.scrollRestoration = "manual";
    } catch (_) {}
  }

  // ---------------- Initialization & Refresh ----------------
  async function refreshFiles() {
    if (isRefreshing) return;
    isRefreshing = true;
    scrollFmTop();

    const btnTextEl = refreshBtn ? refreshBtn.querySelector("span") : null;
    if (refreshBtn) refreshBtn.disabled = true;
    if (btnTextEl) btnTextEl.textContent = "Refreshing...";
    else if (refreshBtn) refreshBtn.textContent = "Refreshing...";

    try {
      loadState();
      if (!customDirs.includes(currentDirectory)) {
        currentDirectory = "/";
      }

      if (window.GranTradeDB && typeof window.GranTradeDB.listMedia === "function" && window.GranTradeDB.isConnected()) {
        try {
          const remoteFiles = await window.GranTradeDB.listMedia();
          if (Array.isArray(remoteFiles)) {
            const byName = new Set(files.map((x) => `${x.path}::${x.name}`));
            remoteFiles.forEach((rf) => {
              if (!rf || !rf.name) return;
              const key = `/uploads::${rf.name}`;
              if (!byName.has(key)) {
                files.unshift({
                  id: "sb_" + (rf.id || rf.name),
                  name: rf.name,
                  path: "/uploads",
                  size: (rf.metadata && rf.metadata.size) || 0,
                  type: (rf.metadata && rf.metadata.mimetype) || "application/octet-stream",
                  url: rf.publicUrl || "",
                  modified: (rf.updated_at || new Date().toISOString()).split("T")[0],
                });
                byName.add(key);
              }
            });
          }
        } catch (err) {
          console.warn("Media refresh cloud sync skipped:", err);
        }
      }

      saveState();
      renderFiles();
    } finally {
      isRefreshing = false;
      if (refreshBtn) refreshBtn.disabled = false;
      if (btnTextEl) btnTextEl.textContent = "Refresh";
      else if (refreshBtn) refreshBtn.textContent = "Refresh";
    }
  }

  function init(options) {
    options = options || {};
    loadState();
    loadUiState();

    breadcrumbsEl = document.getElementById(options.breadcrumbsId || "fmBreadcrumbs");
    fileGridEl = document.getElementById(options.fileGridId || "fmFileGrid");
    fileTableWrapEl = document.getElementById(options.fileTableWrapId || "fmFileTableWrap");
    fileTableBodyEl = document.getElementById(options.fileTableBodyId || "fmFileTableBody");
    sidebarTreeEl = document.getElementById(options.sidebarTreeId || "fmSidebarTree");

    searchInput = document.getElementById(options.searchInputId || "fmSearchInput");
    viewGridBtn = document.getElementById(options.viewGridBtnId || "fmViewGridBtn");
    viewListBtn = document.getElementById(options.viewListBtnId || "fmViewListBtn");
    refreshBtn = document.getElementById(options.refreshBtnId || "fmRefreshBtn");
    fileInput = document.getElementById(options.fileInputId || "fmFileInput");
    dropOverlay = document.getElementById(options.dropOverlayId || "fmDropOverlay");

    previewModal = document.getElementById(options.previewModalId || "fmPreviewModal");
    previewImg = document.getElementById(options.previewImgId || "fmPreviewImg");
    previewEditor = document.getElementById(options.previewEditorId || "fmPreviewEditor");
    previewTitle = document.getElementById(options.previewTitleId || "fmPreviewTitle");
    previewMeta = document.getElementById(options.previewMetaId || "fmPreviewMeta");
    previewDownloadBtn = document.getElementById(options.previewDownloadBtnId || "fmPreviewDownloadBtn");
    previewCopyBtn = document.getElementById(options.previewCopyBtnId || "fmPreviewCopyBtn");
    previewSaveBtn = document.getElementById(options.previewSaveBtnId || "fmPreviewSaveBtn");

    totalFilesStatEl = document.getElementById("fmTotalFilesStat");
    totalSizeStatEl = document.getElementById("fmTotalSizeStat");

    // Apply restored search and view mode UI
    if (searchInput && searchQuery) searchInput.value = searchQuery;
    if (viewGridBtn && viewListBtn) {
      viewGridBtn.classList.toggle("active", viewMode === "grid");
      viewListBtn.classList.toggle("active", viewMode === "list");
    }

    // Mobile/tablet directory drawer toggle
    sidebarEl = document.getElementById(options.sidebarId || "fmSidebar") || (sidebarTreeEl ? sidebarTreeEl.closest(".fm-sidebar") : null);
    sidebarToggleBtn = document.getElementById(options.sidebarToggleBtnId || "fmSidebarToggleBtn");
    sidebarScrimEl = document.getElementById(options.sidebarScrimId || "fmSidebarScrim");

    function setSidebarOpen(open) {
      if (!sidebarEl) return;
      sidebarEl.classList.toggle("open", open);
      if (sidebarScrimEl) sidebarScrimEl.classList.toggle("open", open);
      if (sidebarToggleBtn) sidebarToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (sidebarToggleBtn && sidebarEl && !sidebarToggleBtn.dataset.bound) {
      sidebarToggleBtn.dataset.bound = "true";
      sidebarToggleBtn.addEventListener("click", () => {
        setSidebarOpen(!sidebarEl.classList.contains("open"));
      });
    }
    if (sidebarScrimEl && !sidebarScrimEl.dataset.bound) {
      sidebarScrimEl.dataset.bound = "true";
      sidebarScrimEl.addEventListener("click", () => setSidebarOpen(false));
    }

    // Search input listener
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        saveUiState();
        renderFiles();
      });
    }

    // View toggles
    if (viewGridBtn) {
      viewGridBtn.addEventListener("click", () => {
        viewMode = "grid";
        viewGridBtn.classList.add("active");
        if (viewListBtn) viewListBtn.classList.remove("active");
        saveUiState();
        renderFiles();
      });
    }
    if (viewListBtn) {
      viewListBtn.addEventListener("click", () => {
        viewMode = "list";
        viewListBtn.classList.add("active");
        if (viewGridBtn) viewGridBtn.classList.remove("active");
        saveUiState();
        renderFiles();
      });
    }

    // File input picker
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
          handleFilesUpload(e.target.files);
        }
      });
    }

    // Drag and Drop
    const mainPane = document.getElementById(options.mainPaneId || "fmMainPane");
    if (mainPane) {
      mainPane.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (dropOverlay) dropOverlay.classList.add("active");
      });
      mainPane.addEventListener("dragleave", (e) => {
        if (e.relatedTarget === null && dropOverlay) {
          dropOverlay.classList.remove("active");
        }
      });
      mainPane.addEventListener("drop", (e) => {
        e.preventDefault();
        if (dropOverlay) dropOverlay.classList.remove("active");
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
          handleFilesUpload(e.dataTransfer.files);
        }
      });
    }

    // Preview actions
    if (previewDownloadBtn) {
      previewDownloadBtn.addEventListener("click", () => {
        if (currentPreviewFile) downloadFile(currentPreviewFile.id);
      });
    }
    if (previewCopyBtn) {
      previewCopyBtn.addEventListener("click", () => {
        if (currentPreviewFile) copyUrl(currentPreviewFile.url);
      });
    }
    if (previewSaveBtn) {
      previewSaveBtn.addEventListener("click", () => {
        saveCurrentFile();
      });
    }

    // Modal close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (previewModal && previewModal.classList.contains("active")) closePreview();
        if (homepageModal && homepageModal.classList.contains("active")) closeHomepageEditor();
        if (sidebarEl && sidebarEl.classList.contains("open")) {
          sidebarEl.classList.remove("open");
          if (sidebarScrimEl) sidebarScrimEl.classList.remove("open");
          if (sidebarToggleBtn) sidebarToggleBtn.setAttribute("aria-expanded", "false");
        }
      }
    });

    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY || e.key === DIRECTORIES_KEY) {
        loadState();
        renderFiles();
      }
    });

    window.addEventListener("beforeunload", scrollFmTop);
    window.addEventListener("pageshow", () => {
      scrollFmTop();
      requestAnimationFrame(scrollFmTop);
    });

    renderFiles();
    scrollFmTop();
  }

  // Public API
  global.GranTradeFileManager = {
    init: init,
    render: renderFiles,
    refresh: refreshFiles,
    setDirectory: function (dir) {
      currentDirectory = dir;
      saveUiState();
      if (sidebarEl && sidebarEl.classList.contains("open")) {
        sidebarEl.classList.remove("open");
        if (sidebarScrimEl) sidebarScrimEl.classList.remove("open");
        if (sidebarToggleBtn) sidebarToggleBtn.setAttribute("aria-expanded", "false");
      }
      renderFiles();
      scrollFmTop();
    },
    openPreview: openPreview,
    closePreview: closePreview,
    saveCurrentFile: saveCurrentFile,
    copyUrl: copyUrl,
    downloadFile: downloadFile,
    deleteFile: deleteFile,
    createFolder: createFolder,
    openHomepageEditor: openHomepageEditor,
    closeHomepageEditor: closeHomepageEditor,
    saveHomepageContent: saveHomepageContent,
    downloadUpdatedIndexHtml: downloadUpdatedIndexHtml,
    triggerUpload: function () {
      if (fileInput) fileInput.click();
    },
    getFiles: () => [...files]
  };
})(window);
