/**
 * GRAN TRADE INC. — ADMIN PORTAL & ONLINE FILE MANAGER SCRIPT
 */

(function () {
  "use strict";

  const AUTH_KEY = "grantrade_admin_auth";
  const DEFAULT_PASS = "grantrade2026";
  const ACTIVE_PANE_KEY = "grantrade_admin_active_pane";
  const FILTER_SEARCH_KEY = "grantrade_admin_search";
  const FILTER_CAT_KEY = "grantrade_admin_cat";

  let currentStones = [];
  let currentLeads = [];
  let currentMedia = [];
  let currentPaneId = "paneInventory";

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeImageSrc(url, fallback) {
    const val = String(url || "").trim();
    if (!val) return fallback;
    if (/^(?:https?:\/\/|assets\/|data:image\/)/i.test(val)) return val;
    return fallback;
  }

  // DOM Elements
  const authGate = document.getElementById("authGate");
  const authForm = document.getElementById("authForm");
  const authPass = document.getElementById("authPass");
  const authError = document.getElementById("authError");
  const logoutBtn = document.getElementById("logoutBtn");

  const navItems = document.querySelectorAll(".nav-item[data-pane]");
  const panes = document.querySelectorAll(".admin-pane");
  const adminSidebar = document.getElementById("adminSidebar");
  const adminMenuBtn = document.getElementById("adminMenuBtn");
  const adminScrim = document.getElementById("adminScrim");

  function setAdminSidebar(open) {
    if (!adminSidebar) return;
    adminSidebar.classList.toggle("open", open);
    if (adminScrim) adminScrim.classList.toggle("open", open);
    if (adminMenuBtn) adminMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (adminMenuBtn && adminSidebar) {
    adminMenuBtn.addEventListener("click", function () {
      setAdminSidebar(!adminSidebar.classList.contains("open"));
    });
    if (adminScrim) {
      adminScrim.addEventListener("click", function () {
        setAdminSidebar(false);
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && adminSidebar.classList.contains("open")) {
        setAdminSidebar(false);
      }
    });
    const mq = window.matchMedia("(min-width: 961px)");
    const onMq = function (ev) {
      if (ev.matches && adminSidebar.classList.contains("open")) setAdminSidebar(false);
    };
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", onMq);
  }

  // Inventory Elements
  const stonesTableBody = document.getElementById("stonesTableBody");
  const stoneSearchInput = document.getElementById("stoneSearchInput");
  const stoneCatFilter = document.getElementById("stoneCatFilter");
  const btnRefreshInventory = document.getElementById("btnRefreshInventory");
  const btnRefreshMedia = document.getElementById("btnRefreshMedia");
  const btnRefreshLeads = document.getElementById("btnRefreshLeads");
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
  function setRefreshButtonState(btn, busy, idleLabel) {
    if (!btn) return;
    btn.disabled = Boolean(busy);
    btn.textContent = busy ? "Refreshing..." : (idleLabel || "Refresh");
  }

  function scrollAdminTop() {
    try {
      const htmlEl = document.documentElement;
      const prevBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      htmlEl.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      const adminMain = document.querySelector(".admin-main");
      if (adminMain) adminMain.scrollTop = 0;
      const fmMain = document.getElementById("fmMainPane");
      if (fmMain) fmMain.scrollTop = 0;
      htmlEl.style.scrollBehavior = prevBehavior;
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }

  if ("scrollRestoration" in window.history) {
    try {
      window.history.scrollRestoration = "manual";
    } catch (_) {}
  }

  function isValidPane(paneId) {
    return Boolean(paneId && document.getElementById(paneId));
  }

  function getSavedPane() {
    const hashPane = (window.location.hash || "").replace(/^#/, "").trim();
    if (isValidPane(hashPane)) {
      try {
        sessionStorage.setItem(ACTIVE_PANE_KEY, hashPane);
      } catch (_) {}
      if (window.history && typeof window.history.replaceState === "function") {
        try {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        } catch (_) {}
      }
      return hashPane;
    }
    try {
      const stored = sessionStorage.getItem(ACTIVE_PANE_KEY);
      if (isValidPane(stored)) return stored;
    } catch (_) {}
    return "paneInventory";
  }

  function activatePane(targetPane) {
    const paneId = isValidPane(targetPane) ? targetPane : "paneInventory";
    currentPaneId = paneId;

    navItems.forEach((n) => {
      n.classList.toggle("active", n.getAttribute("data-pane") === paneId);
    });
    panes.forEach((p) => {
      p.classList.toggle("active", p.id === paneId);
    });

    try {
      sessionStorage.setItem(ACTIVE_PANE_KEY, paneId);
    } catch (_) {}

    if (paneId === "paneInventory") loadInventory();
    if (paneId === "paneMedia") loadMedia();
    if (paneId === "paneLeads") loadLeads();
    if (paneId === "paneSettings") loadSettings();
    scrollAdminTop();
  }

  navItems.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetPane = this.getAttribute("data-pane");
      activatePane(targetPane);
      setAdminSidebar(false);
    });
  });

  window.addEventListener("hashchange", function () {
    const hashPane = (window.location.hash || "").replace(/^#/, "").trim();
    if (isValidPane(hashPane) && hashPane !== currentPaneId) {
      activatePane(hashPane);
    }
  });

  // ---------------- 3. Inventory Catalog Manager ----------------
  function getCatalogHelper() {
    return window.GRAN_TRADE_CATALOG || null;
  }

  function normalizeAdminColors(val) {
    const cat = getCatalogHelper();
    if (cat && typeof cat.normalizeColorTags === "function") {
      return cat.normalizeColorTags(val);
    }
    return String(val || "")
      .split(/[,;|]+/)
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean);
  }

  async function loadInventory() {
    if (!stonesTableBody) return;
    stonesTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--muted);">Loading catalog slabs...</td></tr>`;

    const cat = getCatalogHelper();
    if (cat && typeof cat.refresh === "function") {
      cat.refresh();
    } else if (cat && typeof cat.applyLocalOverrides === "function") {
      cat.applyLocalOverrides();
    }

    try {
      if (window.GranTradeDB && window.GranTradeDB.isConnected()) {
        const remoteStones = await window.GranTradeDB.fetchStones();
        if (cat && typeof cat.setExternalStones === "function" && Array.isArray(remoteStones) && remoteStones.length) {
          cat.setExternalStones(remoteStones, true);
          currentStones = cat.all ? [...cat.all] : remoteStones;
        } else {
          currentStones = Array.isArray(remoteStones) ? remoteStones : [];
        }
      } else if (cat) {
        currentStones = cat.all ? [...cat.all] : [];
      }
    } catch (e) {
      console.warn("Failed loading stones:", e);
      currentStones = (cat && cat.all && [...cat.all]) || [];
    }

    renderStonesTable();
  }

  async function refreshInventory() {
    setRefreshButtonState(btnRefreshInventory, true, "Refresh");
    scrollAdminTop();
    try {
      await loadInventory();
    } finally {
      setRefreshButtonState(btnRefreshInventory, false, "Refresh");
    }
  }

  function renderStonesTable() {
    if (!stonesTableBody) return;
    const q = (stoneSearchInput?.value || "").toLowerCase().trim();
    const cat = stoneCatFilter?.value || "all";

    const filtered = currentStones.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (q) {
        const colorsStr = normalizeAdminColors(s.colors).join(" ");
        const text = `${s.name} ${s.gtNumber} ${s.lotNumber} ${s.category} ${s.origin} ${colorsStr}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      stonesTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--muted);">No stone slabs found.</td></tr>`;
      return;
    }

    const catalogHelper = getCatalogHelper();
    stonesTableBody.innerHTML = filtered
      .map((s) => {
        const safeId = escapeHtml(s.id);
        const safeName = escapeHtml(s.name);
        const safeCatSlug = encodeURIComponent(String(s.category || "quartzite").replace(/[^a-z0-9-]/gi, ""));
        const fallbackImg = `assets/images/stone-types/${safeCatSlug}.jpg`;
        const imgSrc = escapeHtml(safeImageSrc(s.image1, fallbackImg));
        const colorsList = normalizeAdminColors(s.colors);
        const colorPills = colorsList.length
          ? colorsList
              .map((c) => {
                const label = catalogHelper && catalogHelper.formatColorLabel ? catalogHelper.formatColorLabel(c) : c;
                const dot = catalogHelper && catalogHelper.getColorSwatch ? catalogHelper.getColorSwatch(c) : "#8b929a";
                return `<span style="display:inline-flex; align-items:center; gap:0.28rem; padding:0.15rem 0.45rem; border-radius:999px; border:1px solid var(--line); font-size:0.72rem; background:var(--bg);"><span style="width:8px; height:8px; border-radius:50%; background:${escapeHtml(dot)}; border:1px solid rgba(0,0,0,0.2);"></span>${escapeHtml(label)}</span>`;
              })
              .join(" ")
          : `<span style="font-size:0.75rem; color:var(--muted);">No tags</span>`;

        const cleanThick = String(s.thickness || "3 cm")
          .replace(/\b2\s*cm\s*·\s*3\s*cm/gi, "3 cm")
          .replace(/\bcalibrated\b/gi, "")
          .trim() || "3 cm";

        const noGt = ["granite", "quartzite", "marble"].includes(String(s.category || "").toLowerCase());
        const gtDisplay = noGt ? "—" : (s.gtNumber || "—");

        return `
      <tr data-id="${safeId}">
        <td>
          <div class="stone-thumb-cell">
            <img src="${imgSrc}" alt="${safeName}" onerror="this.src='${escapeHtml(fallbackImg)}';" />
            <div>
              <div class="stone-name-title">${safeName}</div>
              <div class="stone-meta-sub">${escapeHtml(s.categoryLabel || s.category)} · ${escapeHtml(s.origin || '')}</div>
            </div>
          </div>
        </td>
        <td><strong style="color:var(--accent);">${escapeHtml(gtDisplay)}</strong></td>
        <td><code>${escapeHtml(s.lotNumber || '—')}</code></td>
        <td>${escapeHtml(cleanThick)}</td>
        <td>
          <div style="display:flex; flex-wrap:wrap; gap:0.25rem; align-items:center; max-width:220px;">
            ${colorPills}
          </div>
        </td>
        <td>${escapeHtml(s.size || 'Full Slab')}</td>
        <td style="text-align:right; white-space:nowrap;">
          <button class="btn btn-sm btn-secondary" type="button" data-stone-action="tags" data-stone-id="${safeId}">Tags</button>
          <button class="btn btn-sm btn-secondary" type="button" data-stone-action="edit" data-stone-id="${safeId}">Edit</button>
          <button class="btn btn-sm" type="button" style="color:var(--danger); border:1px solid var(--line);" data-stone-action="delete" data-stone-id="${safeId}">Delete</button>
        </td>
      </tr>
    `;
      })
      .join("");
  }

  if (stonesTableBody) {
    stonesTableBody.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-stone-action]");
      if (!btn || !window.GranTradeAdmin) return;
      const action = btn.getAttribute("data-stone-action");
      const id = btn.getAttribute("data-stone-id") || "";
      if (action === "tags") {
        window.GranTradeAdmin.openEditModal(id);
        document.getElementById("fieldColors")?.focus();
      } else if (action === "edit") {
        window.GranTradeAdmin.openEditModal(id);
      } else if (action === "delete") {
        window.GranTradeAdmin.deleteStone(id);
      }
    });
  }

  if (stoneSearchInput) {
    stoneSearchInput.addEventListener("input", function () {
      try {
        sessionStorage.setItem(FILTER_SEARCH_KEY, stoneSearchInput.value || "");
      } catch (_) {}
      renderStonesTable();
    });
  }
  if (stoneCatFilter) {
    stoneCatFilter.addEventListener("change", function () {
      try {
        sessionStorage.setItem(FILTER_CAT_KEY, stoneCatFilter.value || "all");
      } catch (_) {}
      renderStonesTable();
    });
  }
  if (btnRefreshInventory) {
    btnRefreshInventory.addEventListener("click", refreshInventory);
  }

  // ---------------- 4. Modal Editor ----------------
  const fieldColorsEl = document.getElementById("fieldColors");
  const adminColorPresets = document.getElementById("adminColorPresets");
  const fieldCategoryEl = document.getElementById("fieldCategory");
  const fieldGtEl = document.getElementById("fieldGt");

  function syncGtFieldState() {
    if (!fieldCategoryEl || !fieldGtEl) return;
    const noGt = ["granite", "quartzite", "marble"].includes(fieldCategoryEl.value);
    fieldGtEl.disabled = noGt;
    if (noGt) {
      fieldGtEl.value = "";
      fieldGtEl.placeholder = "Not used for Granite, Quartzite & Marble";
    } else {
      fieldGtEl.placeholder = "e.g. GT-1001";
    }
  }

  if (fieldCategoryEl) {
    fieldCategoryEl.addEventListener("change", syncGtFieldState);
  }

  function syncPresetButtons() {
    if (!adminColorPresets || !fieldColorsEl) return;
    const activeSet = new Set(normalizeAdminColors(fieldColorsEl.value));
    adminColorPresets.querySelectorAll("[data-color-preset]").forEach((btn) => {
      const key = btn.getAttribute("data-color-preset");
      const isOn = activeSet.has(key);
      btn.classList.toggle("btn-primary", isOn);
      btn.classList.toggle("btn-secondary", !isOn);
    });
  }

  if (adminColorPresets && fieldColorsEl) {
    adminColorPresets.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-color-preset]");
      if (!btn) return;
      const preset = btn.getAttribute("data-color-preset");
      const list = normalizeAdminColors(fieldColorsEl.value);
      const next = list.includes(preset) ? list.filter((x) => x !== preset) : list.concat([preset]);
      fieldColorsEl.value = next.join(", ");
      syncPresetButtons();
    });
    fieldColorsEl.addEventListener("input", syncPresetButtons);
  }

  function openStoneModal(stone) {
    if (!stoneModal || !stoneForm) return;
    stoneForm.reset();

    if (stone) {
      modalTitle.textContent = `Edit Slab: ${stone.name}`;
      document.getElementById("fieldId").value = stone.id;
      document.getElementById("fieldName").value = stone.name || "";
      document.getElementById("fieldCategory").value = stone.category || "quartzite";
      document.getElementById("fieldGt").value = ["granite", "quartzite", "marble"].includes(stone.category) ? "" : (stone.gtNumber || "");
      document.getElementById("fieldLot").value = stone.lotNumber || "";
      document.getElementById("fieldType").value = stone.type || "natural";
      document.getElementById("fieldFinish").value = stone.finish || "Polished";
      document.getElementById("fieldThickness").value = String(stone.thickness || "3 cm").replace(/\b2\s*cm\s*·\s*3\s*cm/gi, "3 cm").replace(/\bcalibrated\b/gi, "").trim() || "3 cm";
      document.getElementById("fieldSize").value = stone.size || "";
      document.getElementById("fieldOrigin").value = stone.origin || "";
      document.getElementById("fieldImage1").value = stone.image1 || "";
      document.getElementById("fieldDesc").value = stone.description || "";
      if (fieldColorsEl) fieldColorsEl.value = normalizeAdminColors(stone.colors).join(", ");
      const stockEl = document.getElementById("fieldInStock");
      if (stockEl) stockEl.checked = stone.inStock !== false;
    } else {
      modalTitle.textContent = "Add New Inventory Slab";
      document.getElementById("fieldId").value = "";
      document.getElementById("fieldCategory").value = "quartzite";
      document.getElementById("fieldType").value = "natural";
      document.getElementById("fieldThickness").value = "3 cm";
      if (fieldColorsEl) fieldColorsEl.value = "";
      const stockEl = document.getElementById("fieldInStock");
      if (stockEl) stockEl.checked = true;
    }

    syncGtFieldState();
    syncPresetButtons();
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
      const colorsArr = fieldColorsEl ? normalizeAdminColors(fieldColorsEl.value) : [];
      const catVal = document.getElementById("fieldCategory").value;
      const gtVal = ["granite", "quartzite", "marble"].includes(catVal) ? "" : document.getElementById("fieldGt").value.trim();

      const stoneObj = {
        id: idVal,
        name: document.getElementById("fieldName").value.trim(),
        gtNumber: gtVal,
        lotNumber: document.getElementById("fieldLot").value.trim(),
        category: catVal,
        categoryLabel: document.getElementById("fieldCategory").selectedOptions[0].text,
        type: document.getElementById("fieldType").value,
        typeLabel: document.getElementById("fieldType").value === "engineered" ? "Engineered Quartz" : "Natural Stone",
        finish: document.getElementById("fieldFinish").value.trim(),
        thickness: document.getElementById("fieldThickness").value.trim() || "3 cm",
        size: document.getElementById("fieldSize").value.trim(),
        origin: document.getElementById("fieldOrigin").value.trim(),
        colors: colorsArr,
        image1: document.getElementById("fieldImage1").value.trim() || `assets/images/stone-types/${document.getElementById("fieldCategory").value}.jpg`,
        image2: document.getElementById("fieldImage1").value.trim(),
        description: document.getElementById("fieldDesc").value.trim(),
        inStock: document.getElementById("fieldInStock") ? document.getElementById("fieldInStock").checked : true,
      };

      try {
        if (window.GranTradeDB && window.GranTradeDB.isConnected()) {
          await window.GranTradeDB.saveStone(stoneObj);
        }

        const cat = getCatalogHelper();
        if (cat && typeof cat.saveOverride === "function") {
          cat.saveOverride(stoneObj.id, stoneObj);
        }

        // Update local memory
        const existingIdx = currentStones.findIndex((s) => s.id === stoneObj.id);
        if (existingIdx !== -1) {
          currentStones[existingIdx] = Object.assign({}, currentStones[existingIdx], stoneObj);
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
    if (!window.GranTradeFileManager) return;
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
        refreshBtnId: "btnRefreshMedia",
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
    } else if (typeof window.GranTradeFileManager.refresh === "function") {
      window.GranTradeFileManager.refresh();
    } else if (typeof window.GranTradeFileManager.render === "function") {
      window.GranTradeFileManager.render();
    }
  }

  async function refreshMedia() {
    setRefreshButtonState(btnRefreshMedia, true, "Refresh");
    try {
      if (!fileManagerReady) {
        loadMedia();
      } else if (window.GranTradeFileManager && typeof window.GranTradeFileManager.refresh === "function") {
        await window.GranTradeFileManager.refresh();
      }
    } finally {
      setRefreshButtonState(btnRefreshMedia, false, "Refresh");
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

  async function refreshLeads() {
    setRefreshButtonState(btnRefreshLeads, true, "Refresh");
    scrollAdminTop();
    try {
      await loadLeads();
    } finally {
      setRefreshButtonState(btnRefreshLeads, false, "Refresh");
    }
  }

  if (btnRefreshLeads) {
    btnRefreshLeads.addEventListener("click", refreshLeads);
  }

  function renderLeadsTable() {
    if (!leadsTableBody) return;
    if (leadsCountBadge) leadsCountBadge.textContent = currentLeads.length;

    if (currentLeads.length === 0) {
      leadsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--muted);">No wholesale inquiries submitted yet.</td></tr>`;
      return;
    }

    leadsTableBody.innerHTML = currentLeads
      .map((lead) => {
        const safeLeadId = escapeHtml(lead.id || "");
        const safeEmail = escapeHtml(lead.email || "");
        const mailHref = `mailto:${encodeURIComponent(String(lead.email || "").trim())}`;
        return `
      <tr>
        <td>
          <div style="font-weight:600;">${escapeHtml(lead.full_name || lead.name || "")}</div>
          <div style="font-size:0.75rem; color:var(--muted);">${escapeHtml(lead.company || 'Direct Buyer')} · ${escapeHtml(lead.role || 'trade')}</div>
        </td>
        <td>
          <a href="${escapeHtml(mailHref)}" style="color:var(--accent); text-decoration:none;">${safeEmail}</a>
          ${lead.phone ? `<div style="font-size:0.75rem; color:var(--muted);">${escapeHtml(lead.phone)}</div>` : ''}
        </td>
        <td><strong>${escapeHtml(lead.stone_interest || lead.stone || 'General Walkthrough')}</strong></td>
        <td style="max-width:280px; font-size:0.8rem; white-space:pre-wrap;">${escapeHtml(lead.message || '')}</td>
        <td>
          <select class="admin-select" style="padding:0.35rem; font-size:0.8rem;" data-lead-id="${safeLeadId}">
            <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New Lead</option>
            <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="held" ${lead.status === 'held' ? 'selected' : ''}>Bundle Held</option>
            <option value="archived" ${lead.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </td>
        <td style="font-size:0.75rem; color:var(--muted);">${escapeHtml(new Date(lead.created_at).toLocaleDateString())}</td>
      </tr>
    `;
      })
      .join("");
  }

  if (leadsTableBody) {
    leadsTableBody.addEventListener("change", function (e) {
      const select = e.target.closest("select[data-lead-id]");
      if (!select || !window.GranTradeAdmin) return;
      const leadId = select.getAttribute("data-lead-id") || "";
      window.GranTradeAdmin.updateLeadStatus(leadId, select.value);
    });
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
      const cat = getCatalogHelper();
      const count = (cat && cat.all && cat.all.length) || currentStones.length || 50;
      if (!confirm(`This will upload all ${count} local stones into your Supabase database table. Proceed?`)) return;
      try {
        await window.GranTradeDB.syncLocalCatalogToCloud();
        alert(`All ${count} catalog stones successfully synced to Supabase PostgreSQL!`);
        await loadInventory();
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

  async function refreshAll() {
    await refreshInventory();
    if (currentPaneId === "paneMedia" || fileManagerReady) await refreshMedia();
    if (currentPaneId === "paneLeads") await refreshLeads();
    if (currentPaneId === "paneSettings") loadSettings();
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
        const cat = getCatalogHelper();
        if (cat && typeof cat.deleteOverride === "function") {
          cat.deleteOverride(id);
          currentStones = cat.all ? [...cat.all] : currentStones.filter((s) => s.id !== id);
        } else {
          currentStones = currentStones.filter((s) => s.id !== id);
        }
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
        const cat = getCatalogHelper();
        if (cat && typeof cat.saveOverride === "function") {
          cat.saveOverride(id, { inStock });
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

    refreshInventory: refreshInventory,
    refreshMedia: refreshMedia,
    refreshLeads: refreshLeads,
    refreshAll: refreshAll,
  };

  function restoreSavedFilters() {
    try {
      const savedQ = sessionStorage.getItem(FILTER_SEARCH_KEY);
      if (savedQ !== null && stoneSearchInput) stoneSearchInput.value = savedQ;
      const savedCat = sessionStorage.getItem(FILTER_CAT_KEY);
      if (savedCat && stoneCatFilter && Array.from(stoneCatFilter.options).some((o) => o.value === savedCat)) {
        stoneCatFilter.value = savedCat;
      }
    } catch (_) {}
  }

  window.addEventListener("storage", function (e) {
    if (e.key === "granTrade_stone_overrides_v1" && sessionStorage.getItem(AUTH_KEY) === "true") {
      loadInventory();
    }
  });

  window.addEventListener("beforeunload", function () {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (_) {}
    }
    scrollAdminTop();
  });

  window.addEventListener("pageshow", function (e) {
    scrollAdminTop();
    requestAnimationFrame(scrollAdminTop);
    if (e.persisted && sessionStorage.getItem(AUTH_KEY) === "true") {
      activatePane(getSavedPane());
    }
  });

  window.addEventListener("load", function () {
    scrollAdminTop();
    requestAnimationFrame(scrollAdminTop);
  });

  function initDashboard() {
    restoreSavedFilters();
    const initialPane = getSavedPane();
    activatePane(initialPane);
    if (initialPane !== "paneInventory") {
      loadInventory();
    }
    scrollAdminTop();
  }

  // Start
  checkAuth();
})();

