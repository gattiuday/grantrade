/**
 * GRAN TRADE INC. — OPEN SOURCE WEB FILE MANAGER ENGINE
 * Lightweight, self-contained client-side web file manager with Supabase Storage sync.
 */

(function (global) {
  "use strict";

  // Initial Built-in Website Asset Manifest
  const DEFAULT_FILES = [
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
    { id: "f14", name: "products.json", path: "/data", size: 42662, type: "application/json", url: "data/products.json", modified: "2026-11-03", content: '{\n  "version": "1.0",\n  "company": "Gran Trade Inc.",\n  "totalStones": 50\n}' },
    { id: "f15", name: "DEPLOYMENT.md", path: "/docs", size: 6800, type: "text/markdown", url: "docs/DEPLOYMENT.md", modified: "2026-11-03", content: '# Gran Trade Inc. Deployment Guide\n\nConfigure custom domains, static hosting, and forms.' }
  ];

  const STORAGE_KEY = "grantrade_fm_files";
  const DIRECTORIES_KEY = "grantrade_fm_dirs";

  let files = [];
  let customDirs = ["/", "/assets/images", "/assets/images/stone-types", "/data", "/docs", "/uploads"];
  let currentDirectory = "/";
  let searchQuery = "";
  let viewMode = "grid"; // "grid" | "list"
  let currentPreviewFile = null;

  // DOM Elements Cache
  let breadcrumbsEl, fileGridEl, fileTableBodyEl, fileTableWrapEl, sidebarTreeEl;
  let searchInput, viewGridBtn, viewListBtn, fileInput, dropOverlay;
  let previewModal, previewImg, previewEditor, previewTitle, previewMeta, previewDownloadBtn, previewCopyBtn;
  let totalFilesStatEl, totalSizeStatEl;

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        files = JSON.parse(saved);
      } else {
        files = [...DEFAULT_FILES];
        saveState();
      }
      const savedDirs = localStorage.getItem(DIRECTORIES_KEY);
      if (savedDirs) {
        customDirs = JSON.parse(savedDirs);
      }
    } catch (_) {
      files = [...DEFAULT_FILES];
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
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
      const dirMatch = currentDirectory === "/" ? true : f.path.startsWith(currentDirectory);
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
        if (d === "/" || f.path.startsWith(d)) {
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

  function renderStorageStats() {
    const totalFiles = files.length;
    const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);

    if (totalFilesStatEl) totalFilesStatEl.textContent = `${totalFiles} Files`;
    if (totalSizeStatEl) totalSizeStatEl.textContent = formatBytes(totalBytes);
  }

  function renderFiles() {
    const list = getFilteredFiles();
    renderBreadcrumbs();
    renderSidebarTree();
    renderStorageStats();

    if (viewMode === "grid") {
      if (fileTableWrapEl) fileTableWrapEl.style.display = "none";
      if (fileGridEl) {
        fileGridEl.style.display = "grid";
        if (list.length === 0) {
          fileGridEl.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:3.5rem 1rem; color:var(--muted);">
              <svg width="44" height="44" style="margin:0 auto 12px; display:block; opacity:0.5;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>
              <h3>Folder is empty</h3>
              <p style="font-size:0.85rem; margin-top:0.35rem;">Drag and drop files here to upload to this directory.</p>
            </div>
          `;
          return;
        }

        fileGridEl.innerHTML = list
          .map((f) => {
            const isImg = f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);
            return `
              <div class="fm-file-card" onclick="window.GranTradeFileManager.openPreview('${f.id}')">
                <div class="fm-file-preview-wrap">
                  ${
                    isImg
                      ? `<img src="${f.url}" alt="${f.name}" class="fm-file-thumb" onerror="this.onerror=null; this.src='assets/images/stone-types/quartzite.jpg';" />`
                      : `<div class="fm-file-icon-box">${getFileIcon(f.type, f.name)}<span class="fm-file-ext-tag">${f.name.split(".").pop()}</span></div>`
                  }
                </div>
                <div class="fm-file-card-info">
                  <div class="fm-file-card-name" title="${f.name}">${f.name}</div>
                  <div class="fm-file-card-meta">
                    <span>${formatBytes(f.size)}</span>
                    <span>${f.path.replace(/^\/assets/, "") || "/"}</span>
                  </div>
                  <div class="fm-card-quick-actions" onclick="event.stopPropagation();">
                    <button class="btn btn-sm btn-secondary" style="flex:1; padding:2px 6px; font-size:0.72rem;" onclick="window.GranTradeFileManager.copyUrl('${f.url}')">Copy URL</button>
                    <button class="btn btn-sm btn-secondary" style="padding:2px 6px; font-size:0.72rem;" onclick="window.GranTradeFileManager.downloadFile('${f.id}')">Download</button>
                    <button class="btn btn-sm" style="color:var(--danger); border:1px solid var(--line); padding:2px 6px; font-size:0.72rem;" onclick="window.GranTradeFileManager.deleteFile('${f.id}')">&times;</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
      }
    } else {
      // List Table View
      if (fileGridEl) fileGridEl.style.display = "none";
      if (fileTableWrapEl) {
        fileTableWrapEl.style.display = "block";
        if (!fileTableBodyEl) return;
        if (list.length === 0) {
          fileTableBodyEl.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:3rem; color:var(--muted);">No files match your search criteria.</td></tr>`;
          return;
        }

        fileTableBodyEl.innerHTML = list
          .map((f) => {
            const isImg = f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);
            return `
              <tr onclick="window.GranTradeFileManager.openPreview('${f.id}')" style="cursor:pointer;">
                <td>
                  <div class="fm-table-file-cell">
                    ${
                      isImg
                        ? `<img src="${f.url}" alt="${f.name}" class="fm-table-thumb" onerror="this.src='assets/images/stone-types/quartzite.jpg';" />`
                        : `<div class="fm-table-thumb" style="display:flex; align-items:center; justify-content:center;">${getFileIcon(f.type, f.name)}</div>`
                    }
                    <div>
                      <div style="font-weight:600; color:var(--ink);">${f.name}</div>
                      <div style="font-size:0.75rem; color:var(--muted);">${f.path}</div>
                    </div>
                  </div>
                </td>
                <td><code>${f.name.split(".").pop().toUpperCase()}</code></td>
                <td>${formatBytes(f.size)}</td>
                <td>${f.modified || "2026-11-03"}</td>
                <td style="text-align:right;" onclick="event.stopPropagation();">
                  <button class="btn btn-sm btn-secondary" onclick="window.GranTradeFileManager.copyUrl('${f.url}')">Copy URL</button>
                  <button class="btn btn-sm btn-secondary" onclick="window.GranTradeFileManager.downloadFile('${f.id}')">Download</button>
                  <button class="btn btn-sm" style="color:var(--danger); border:1px solid var(--line);" onclick="window.GranTradeFileManager.deleteFile('${f.id}')">Delete</button>
                </td>
              </tr>
            `;
          })
          .join("");
      }
    }
  }

  // ---------------- File Actions ----------------
  async function handleFilesUpload(fileList) {
    for (const file of Array.from(fileList)) {
      const isImg = file.type.startsWith("image/");
      const blobUrl = URL.createObjectURL(file);

      // Check if Supabase Cloud Storage is connected
      let finalUrl = blobUrl;
      if (global.GranTradeDB && global.GranTradeDB.isConnected()) {
        try {
          const res = await global.GranTradeDB.uploadMedia(file, currentDirectory.replace(/^\//, ""));
          if (res && res.publicUrl) finalUrl = res.publicUrl;
        } catch (err) {
          console.warn("[FileManager] Supabase upload failed, falling back to local object URL:", err);
        }
      }

      let fileContent = "";
      if (file.type.startsWith("text/") || file.name.endsWith(".json") || file.name.endsWith(".md")) {
        try {
          fileContent = await file.text();
        } catch (_) {}
      }

      const newFileObj = {
        id: "f_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        name: file.name,
        path: currentDirectory === "/" ? "/uploads" : currentDirectory,
        size: file.size,
        type: file.type || "application/octet-stream",
        url: finalUrl,
        modified: new Date().toISOString().split("T")[0],
        content: fileContent
      };

      files.unshift(newFileObj);
    }

    saveState();
    renderFiles();
  }

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
    } else if (previewEditor) {
      if (previewImg) previewImg.style.display = "none";
      previewEditor.style.display = "block";
      previewEditor.value = f.content || `/* Binary or media file: ${f.name} */\n/* Size: ${formatBytes(f.size)} */`;
    }

    previewModal.classList.add("active");
  }

  function closePreview() {
    if (previewModal) previewModal.classList.remove("active");
    currentPreviewFile = null;
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

  // ---------------- Initialization ----------------
  function init(options) {
    loadState();

    breadcrumbsEl = document.getElementById(options.breadcrumbsId || "fmBreadcrumbs");
    fileGridEl = document.getElementById(options.fileGridId || "fmFileGrid");
    fileTableWrapEl = document.getElementById(options.fileTableWrapId || "fmFileTableWrap");
    fileTableBodyEl = document.getElementById(options.fileTableBodyId || "fmFileTableBody");
    sidebarTreeEl = document.getElementById(options.sidebarTreeId || "fmSidebarTree");

    searchInput = document.getElementById(options.searchInputId || "fmSearchInput");
    viewGridBtn = document.getElementById(options.viewGridBtnId || "fmViewGridBtn");
    viewListBtn = document.getElementById(options.viewListBtnId || "fmViewListBtn");
    fileInput = document.getElementById(options.fileInputId || "fmFileInput");
    dropOverlay = document.getElementById(options.dropOverlayId || "fmDropOverlay");

    previewModal = document.getElementById(options.previewModalId || "fmPreviewModal");
    previewImg = document.getElementById(options.previewImgId || "fmPreviewImg");
    previewEditor = document.getElementById(options.previewEditorId || "fmPreviewEditor");
    previewTitle = document.getElementById(options.previewTitleId || "fmPreviewTitle");
    previewMeta = document.getElementById(options.previewMetaId || "fmPreviewMeta");
    previewDownloadBtn = document.getElementById(options.previewDownloadBtnId || "fmPreviewDownloadBtn");
    previewCopyBtn = document.getElementById(options.previewCopyBtnId || "fmPreviewCopyBtn");

    totalFilesStatEl = document.getElementById("fmTotalFilesStat");
    totalSizeStatEl = document.getElementById("fmTotalSizeStat");

    // Search input listener
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        renderFiles();
      });
    }

    // View toggles
    if (viewGridBtn) {
      viewGridBtn.addEventListener("click", () => {
        viewMode = "grid";
        viewGridBtn.classList.add("active");
        if (viewListBtn) viewListBtn.classList.remove("active");
        renderFiles();
      });
    }
    if (viewListBtn) {
      viewListBtn.addEventListener("click", () => {
        viewMode = "list";
        viewListBtn.classList.add("active");
        if (viewGridBtn) viewGridBtn.classList.remove("active");
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

    // Modal close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && previewModal && previewModal.classList.contains("active")) {
        closePreview();
      }
    });

    renderFiles();
  }

  // Public API
  global.GranTradeFileManager = {
    init: init,
    setDirectory: function (dir) {
      currentDirectory = dir;
      renderFiles();
    },
    openPreview: openPreview,
    closePreview: closePreview,
    copyUrl: copyUrl,
    downloadFile: downloadFile,
    deleteFile: deleteFile,
    createFolder: createFolder,
    triggerUpload: function () {
      if (fileInput) fileInput.click();
    },
    getFiles: () => [...files]
  };
})(window);
