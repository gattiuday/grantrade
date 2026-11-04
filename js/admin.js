/**
 * GRAN TRADE INC. — ADMIN PORTAL & ONLINE FILE MANAGER SCRIPT
 */

(function () {
  "use strict";

  const AUTH_KEY = "grantrade_admin_auth";
  const DEFAULT_PASS = "grantrade2026";

  let currentStones = [];
  let currentLeads = [];
  let currentMedia = [];

  // DOM Elements
  const authGate = document.getElementById("authGate");
  const authForm = document.getElementById("authForm");
  const authPass = document.getElementById("authPass");
  const authError = document.getElementById("authError");
  const logoutBtn = document.getElementById("logoutBtn");

  const navItems = document.querySelectorAll(".nav-item[data-pane]");
  const panes = document.querySelectorAll(".admin-pane");

  // Inventory Elements
  const stonesTableBody = document.getElementById("stonesTableBody");
  const stoneSearchInput = document.getElementById("stoneSearchInput");
  const stoneCatFilter = document.getElementById("stoneCatFilter");
  const btnNewStone = document.getElementById("btnNewStone");
  const btnSyncCloud = document.getElementById("btnSyncCloud");
  const btnExportJson = document.getElementById("btnExportJson");

  // Modal Elements
  const stoneModal = document.getElementById("stoneModal");
  const stoneForm = document.getElementById("stoneForm");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalTitle = document.getElementById("modalTitle");

  // Media Elements
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const mediaGrid = document.getElementById("mediaGrid");
  const mediaLoading = document.getElementById("mediaLoading");

  // Inquiries Elements
  const leadsTableBody = document.getElementById("leadsTableBody");
  const leadsCountBadge = document.getElementById("leadsCountBadge");

  // Settings Elements
  const settingsForm = document.getElementById("settingsForm");
  const supabaseUrlInput = document.getElementById("supabaseUrlInput");
  const supabaseKeyInput = document.getElementById("supabaseKeyInput");
  const btnTestConnection = document.getElementById("btnTestConnection");
  const connStatusBadge = document.getElementById("connStatusBadge");

  // ---------------- 1. Authentication ----------------
  function checkAuth() {
    const isAuthed = sessionStorage.getItem(AUTH_KEY) === "true";
    if (isAuthed) {
      if (authGate) authGate.style.display = "none";
      initDashboard();
    } else {
      if (authGate) authGate.style.display = "flex";
      if (authPass) authPass.focus();
    }
  }

  if (authForm) {
    authForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const entered = (authPass.value || "").trim();
      if (entered === DEFAULT_PASS) {
        sessionStorage.setItem(AUTH_KEY, "true");
        if (authGate) authGate.style.display = "none";
        initDashboard();
      } else {
        if (authError) authError.style.display = "block";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem(AUTH_KEY);
      window.location.reload();
    });
  }

  // ---------------- 2. Navigation ----------------
  navItems.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetPane = this.getAttribute("data-pane");
      navItems.forEach((n) => n.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));

      this.classList.add("active");
      const activePaneEl = document.getElementById(targetPane);
      if (activePaneEl) activePaneEl.classList.add("active");

      if (targetPane === "paneInventory") loadInventory();
      if (targetPane === "paneMedia") loadMedia();
      if (targetPane === "paneLeads") loadLeads();
      if (targetPane === "paneSettings") loadSettings();
    });
  });

  // ---------------- 3. Inventory Catalog Manager ----------------
  async function loadInventory() {
    if (!stonesTableBody) return;
    stonesTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--muted);">Loading catalog slabs...</td></tr>`;

    try {
      if (window.GranTradeDB) {
        currentStones = await window.GranTradeDB.fetchStones();
      } else if (window.GRAN_TRADE_CATALOG) {
        currentStones = window.GRAN_TRADE_CATALOG.all || [];
      }
    } catch (e) {
      console.warn("Failed loading stones:", e);
      currentStones = (window.GRAN_TRADE_CATALOG && window.GRAN_TRADE_CATALOG.all) || [];
    }

    renderStonesTable();
  }

  function renderStonesTable() {
    if (!stonesTableBody) return;
    const q = (stoneSearchInput?.value || "").toLowerCase().trim();
    const cat = stoneCatFilter?.value || "all";

    const filtered = currentStones.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (q) {
        const text = `${s.name} ${s.gtNumber} ${s.lotNumber} ${s.category} ${s.origin}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      stonesTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--muted);">No stone slabs found.</td></tr>`;
      return;
    }

    stonesTableBody.innerHTML = filtered
      .map(
        (s) => `
      <tr data-id="${s.id}">
        <td>
          <div class="stone-thumb-cell">
            <img src="${s.image1 || 'assets/images/stone-types/' + s.category + '.jpg'}" alt="${s.name}" onerror="this.src='assets/images/stone-types/${s.category}.jpg';" />
            <div>
              <div class="stone-name-title">${s.name}</div>
              <div class="stone-meta-sub">${s.categoryLabel || s.category} · ${s.origin || ''}</div>
            </div>
          </div>
        </td>
        <td><strong style="color:var(--accent);">${s.gtNumber || '—'}</strong></td>
        <td><code>${s.lotNumber || '—'}</code></td>
        <td>${s.thickness || '2 cm · 3 cm'}</td>
        <td>${s.size || 'Full Slab'}</td>
        <td style="text-align:right;">
          <button class="btn btn-sm btn-secondary" onclick="window.GranTradeAdmin.openEditModal('${s.id}')">Edit</button>
          <button class="btn btn-sm" style="color:var(--danger); border:1px solid var(--line);" onclick="window.GranTradeAdmin.deleteStone('${s.id}')">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  if (stoneSearchInput) stoneSearchInput.addEventListener("input", renderStonesTable);
  if (stoneCatFilter) stoneCatFilter.addEventListener("change", renderStonesTable);

  // ---------------- 4. Modal Editor ----------------
  function openStoneModal(stone) {
    if (!stoneModal || !stoneForm) return;
    stoneForm.reset();

    if (stone) {
      modalTitle.textContent = `Edit Slab: ${stone.name}`;
      document.getElementById("fieldId").value = stone.id;
      document.getElementById("fieldName").value = stone.name || "";
      document.getElementById("fieldGt").value = stone.gtNumber || "";
      document.getElementById("fieldLot").value = stone.lotNumber || "";
      document.getElementById("fieldCategory").value = stone.category || "quartzite";
      document.getElementById("fieldType").value = stone.type || "natural";
      document.getElementById("fieldFinish").value = stone.finish || "Polished";
      document.getElementById("fieldThickness").value = stone.thickness || "2 cm · 3 cm Calibrated";
      document.getElementById("fieldSize").value = stone.size || "";
      document.getElementById("fieldOrigin").value = stone.origin || "";
      document.getElementById("fieldImage1").value = stone.image1 || "";
      document.getElementById("fieldDesc").value = stone.description || "";
      const stockEl = document.getElementById("fieldInStock");
      if (stockEl) stockEl.checked = stone.inStock !== false;
    } else {
      modalTitle.textContent = "Add New Inventory Slab";
      document.getElementById("fieldId").value = "";
      document.getElementById("fieldCategory").value = "quartzite";
      document.getElementById("fieldType").value = "natural";
      const stockEl = document.getElementById("fieldInStock");
      if (stockEl) stockEl.checked = true;
    }

    stoneModal.style.display = "flex";
  }

  function closeStoneModal() {
    if (stoneModal) stoneModal.style.display = "none";
  }

  if (btnNewStone) btnNewStone.addEventListener("click", () => openStoneModal(null));
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeStoneModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener("click", closeStoneModal);

  if (stoneForm) {
    stoneForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const idVal = document.getElementById("fieldId").value.trim() || document.getElementById("fieldName").value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const stoneObj = {
        id: idVal,
        name: document.getElementById("fieldName").value.trim(),
        gtNumber: document.getElementById("fieldGt").value.trim(),
        lotNumber: document.getElementById("fieldLot").value.trim(),
        category: document.getElementById("fieldCategory").value,
        categoryLabel: document.getElementById("fieldCategory").selectedOptions[0].text,
        type: document.getElementById("fieldType").value,
        typeLabel: document.getElementById("fieldType").value === "engineered" ? "Engineered Quartz" : "Natural Stone",
        finish: document.getElementById("fieldFinish").value.trim(),
        thickness: document.getElementById("fieldThickness").value.trim(),
        size: document.getElementById("fieldSize").value.trim(),
        origin: document.getElementById("fieldOrigin").value.trim(),
        image1: document.getElementById("fieldImage1").value.trim() || `assets/images/stone-types/${document.getElementById("fieldCategory").value}.jpg`,
        image2: document.getElementById("fieldImage1").value.trim(),
        description: document.getElementById("fieldDesc").value.trim(),
        inStock: document.getElementById("fieldInStock") ? document.getElementById("fieldInStock").checked : true,
      };

      try {
        if (window.GranTradeDB && window.GranTradeDB.isConnected()) {
          await window.GranTradeDB.saveStone(stoneObj);
        }

        // Update local memory
        const existingIdx = currentStones.findIndex((s) => s.id === stoneObj.id);
        if (existingIdx !== -1) {
          currentStones[existingIdx] = stoneObj;
        } else {
          currentStones.unshift(stoneObj);
        }

        renderStonesTable();
        closeStoneModal();
        alert(`Slab "${stoneObj.name}" saved successfully!`);
      } catch (err) {
        alert("Error saving slab: " + err.message);
      }
    });
  }

  // ---------------- 5. Open Source Web File Manager ----------------
  let fileManagerReady = false;

  function loadMedia() {
    if (window.GranTradeFileManager) {
      if (!fileManagerReady) {
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
          previewModalId: "fmPreviewModal",
          previewImgId: "fmPreviewImg",
          previewEditorId: "fmPreviewEditor",
          previewTitleId: "fmPreviewTitle",
          previewMetaId: "fmPreviewMeta",
          previewDownloadBtnId: "fmPreviewDownloadBtn",
          previewCopyBtnId: "fmPreviewCopyBtn"
        });
        fileManagerReady = true;
      }
    }
  }

  // ---------------- 6. Leads & Inquiries ----------------
  async function loadLeads() {
    if (!leadsTableBody) return;
    try {
      if (window.GranTradeDB) {
        currentLeads = await window.GranTradeDB.fetchInquiries();
      }
    } catch (e) {
      console.warn("Failed loading leads:", e);
    }
    renderLeadsTable();
  }

  function renderLeadsTable() {
    if (!leadsTableBody) return;
    if (leadsCountBadge) leadsCountBadge.textContent = currentLeads.length;

    if (currentLeads.length === 0) {
      leadsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--muted);">No wholesale inquiries submitted yet.</td></tr>`;
      return;
    }

    leadsTableBody.innerHTML = currentLeads
      .map(
        (lead) => `
      <tr>
        <td>
          <div style="font-weight:600;">${lead.full_name || lead.name}</div>
          <div style="font-size:0.75rem; color:var(--muted);">${lead.company || 'Direct Buyer'} · ${lead.role || 'trade'}</div>
        </td>
        <td>
          <a href="mailto:${lead.email}" style="color:var(--accent); text-decoration:none;">${lead.email}</a>
          ${lead.phone ? `<div style="font-size:0.75rem; color:var(--muted);">${lead.phone}</div>` : ''}
        </td>
        <td><strong>${lead.stone_interest || lead.stone || 'General Walkthrough'}</strong></td>
        <td style="max-width:280px; font-size:0.8rem;">${lead.message || ''}</td>
        <td>
          <select class="admin-select" style="padding:0.35rem; font-size:0.8rem;" onchange="window.GranTradeAdmin.updateLeadStatus('${lead.id}', this.value)">
            <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New Lead</option>
            <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="held" ${lead.status === 'held' ? 'selected' : ''}>Bundle Held</option>
            <option value="archived" ${lead.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </td>
        <td style="font-size:0.75rem; color:var(--muted);">${new Date(lead.created_at).toLocaleDateString()}</td>
      </tr>
    `
      )
      .join("");
  }

  // ---------------- 7. Database & Settings ----------------
  function loadSettings() {
    if (!window.GranTradeDB) return;
    const { url, key } = window.GranTradeDB.getConfig();
    if (supabaseUrlInput) supabaseUrlInput.value = url;
    if (supabaseKeyInput) supabaseKeyInput.value = key;
    updateStatusBadge();
  }

  function updateStatusBadge() {
    if (!connStatusBadge) return;
    const isConn = window.GranTradeDB && window.GranTradeDB.isConnected();
    connStatusBadge.innerHTML = isConn
      ? `<span style="color:#22c55e; font-weight:700;">● Connected to Supabase Cloud</span>`
      : `<span style="color:var(--muted);">⚪ Offline / Local Catalog Mode</span>`;
  }

  if (settingsForm) {
    settingsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const url = (supabaseUrlInput.value || "").trim();
      const key = (supabaseKeyInput.value || "").trim();
      window.GranTradeDB.setConfig(url, key);
      updateStatusBadge();
      alert("Database configuration saved!");
    });
  }

  if (btnTestConnection) {
    btnTestConnection.addEventListener("click", async function () {
      if (!window.GranTradeDB || !window.GranTradeDB.isConnected()) {
        alert("Please save a valid Supabase Project URL and Anon Key first.");
        return;
      }
      try {
        const stones = await window.GranTradeDB.fetchStones();
        alert(`Connection test successful! Retrieved ${stones.length} stones from database.`);
        updateStatusBadge();
      } catch (err) {
        alert("Connection test failed: " + err.message);
      }
    });
  }

  if (btnSyncCloud) {
    btnSyncCloud.addEventListener("click", async function () {
      if (!confirm("This will upload all 50 local stones into your Supabase database table. Proceed?")) return;
      try {
        await window.GranTradeDB.syncLocalCatalogToCloud();
        alert("All 50 catalog stones successfully synced to Supabase PostgreSQL!");
        loadInventory();
      } catch (err) {
        alert("Sync error: " + err.message);
      }
    });
  }

  if (btnExportJson) {
    btnExportJson.addEventListener("click", function () {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentStones, null, 2));
      const dlAnchor = document.createElement("a");
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", "products.json");
      dlAnchor.click();
    });
  }

  // ---------------- Public Window API ----------------
  window.GranTradeAdmin = {
    openEditModal: function (id) {
      const stone = currentStones.find((s) => s.id === id);
      if (stone) openStoneModal(stone);
    },

    deleteStone: async function (id) {
      if (!confirm("Are you sure you want to delete this slab?")) return;
      try {
        if (window.GranTradeDB && window.GranTradeDB.isConnected()) {
          await window.GranTradeDB.deleteStone(id);
        }
        currentStones = currentStones.filter((s) => s.id !== id);
        renderStonesTable();
      } catch (err) {
        alert("Failed to delete slab: " + err.message);
      }
    },

    toggleStock: async function (id, inStock) {
      try {
        if (window.GranTradeDB && window.GranTradeDB.isConnected()) {
          await window.GranTradeDB.toggleStock(id, inStock);
        }
        const s = currentStones.find((x) => x.id === id);
        if (s) s.inStock = inStock;
        renderStonesTable();
      } catch (err) {
        alert("Failed to update stock status: " + err.message);
      }
    },

    deleteMediaFile: async function (name) {
      if (!confirm(`Are you sure you want to delete ${name}?`)) return;
      try {
        if (window.GranTradeDB && window.GranTradeDB.isConnected()) {
          await window.GranTradeDB.deleteMedia(name);
        }
        if (window.GranTradeFileManager) {
          const file = window.GranTradeFileManager.getFiles().find((f) => f.name === name);
          if (file) window.GranTradeFileManager.deleteFile(file.id);
        }
      } catch (err) {
        alert("Failed to delete media: " + err.message);
      }
    },

    updateLeadStatus: async function (id, status) {
      try {
        await window.GranTradeDB.updateInquiryStatus(id, status);
      } catch (err) {
        alert("Failed to update status: " + err.message);
      }
    },
  };

  function initDashboard() {
    loadInventory();
  }

  // Start
  checkAuth();
})();

