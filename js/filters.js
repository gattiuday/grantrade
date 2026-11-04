/**
 * GRAN TRADE INC. — SEARCH, FILTERS & SORT ENGINE (3/5)
 * Job: Prominent hero search, live text search, quick search chips, URL ?q= query handling,
 * multi-facet catalog filtering, custom post tags inspection, dynamic sorting, count & empty state
 */

(function () {
  "use strict";

  const slabGrid = document.getElementById("slabGrid");
  if (!slabGrid) return;

  // Dynamically populate all 50 catalog stones from GRAN_TRADE_CATALOG into the DOM grid
  if (window.GRAN_TRADE_CATALOG && Array.isArray(window.GRAN_TRADE_CATALOG.all)) {
    const emptyEl = document.getElementById("slabEmpty");
    window.GRAN_TRADE_CATALOG.all.forEach(function (s) {
      if (slabGrid.querySelector(`[data-id="${s.id}"]`)) return; // already present

      const thicknessVal = (s.thickness && s.thickness.includes("3") && s.thickness.includes("2")) 
        ? "2 3" 
        : (s.thickness && s.thickness.includes("3") ? "3" : (s.thickness && s.thickness.includes("tile") ? "tile" : "2"));
      const typeVal = s.type || (s.category === "quartz" ? "engineered" : "natural");
      const finishVal = (s.finish || "polished").toLowerCase();
      const colorsVal = Array.isArray(s.colors) ? s.colors.join(" ") : (s.colors || "white");
      const tagsVal = [
        s.name,
        s.gtNumber,
        s.lotNumber,
        s.category,
        s.categoryLabel,
        s.typeLabel,
        s.origin,
        colorsVal,
        finishVal,
        s.application
      ].filter(Boolean).join(" ").toLowerCase();

      // Clean lot number without repeating "LOT" or "Lot"
      const cleanLot = (s.lotNumber || "Stock").replace(/^LOT\s*#?/i, "").trim();
      // Clean size without redundant "Full Slab"
      const cleanSize = (s.size || '128" × 76"').replace(/\s*·\s*Full Slab/i, "").trim();
      // Application highlight badges (non-redundant architectural tags)
      const appHighlights = s.application 
        ? s.application.split(/\s*·\s*/).filter(Boolean)
        : ["Kitchen Islands", "Feature Walls"];
      const appPill1 = appHighlights[0] || "Waterfall Countertops";
      const appPill2 = appHighlights[1] || "Vanity Surfaces";
      const charPill = s.category === "quartzite" ? "Acid-Resistant" : (s.category === "marble" ? "Bookmatched Veins" : (s.category === "granite" ? "High-Traffic" : "Calibrated Quartz"));

      const card = document.createElement("article");
      card.className = "slab-card";
      card.setAttribute("data-id", s.id);
      card.setAttribute("data-cat", s.category);
      card.setAttribute("data-type", typeVal);
      card.setAttribute("data-color", colorsVal);
      card.setAttribute("data-finish", finishVal);
      card.setAttribute("data-thickness", thicknessVal);
      card.setAttribute("data-name", s.name);
      card.setAttribute("data-gt", s.gtNumber || "");
      card.setAttribute("data-lot", s.lotNumber || "");
      card.setAttribute("data-meta", `${s.categoryLabel || s.category} · ${s.name}`);
      card.setAttribute("data-tags", tagsVal);

      card.innerHTML = `
        <div class="sc-tags-hidden" aria-hidden="true" style="display:none;">
          ${s.name}, ${s.categoryLabel || s.category}, ${s.gtNumber || ""}, ${s.lotNumber || ""}, ${s.origin || ""}, ${colorsVal}, ${s.finish || ""}, ${s.thickness || ""}, ${s.application || ""}
        </div>
        <div class="sc-media">
          <div class="sc-media-badges">
            <span class="cat-badge">${s.categoryLabel || s.category}</span>
          </div>
          <button class="heart" type="button" aria-label="Save ${s.name} to favorites" onclick="event.preventDefault(); event.stopPropagation();">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
          </button>
          <a href="slab.html?id=${encodeURIComponent(s.id)}" class="sc-img-link" aria-label="Inspect ${s.name} full slab view" style="display:block; width:100%; height:100%;">
            <img src="${s.image1 || ('assets/images/stone-types/' + s.category + '.jpg')}" alt="${s.name} wholesale stone slab" loading="lazy" onerror="this.onerror=null; this.src='assets/images/stone-types/${s.category}.jpg';" />
          </a>
          <div class="sc-newtab-hint">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
            <span>High-Res Zoom</span>
          </div>
        </div>
        <div class="sc-body">
          <div class="sc-info-block">
            <div class="sc-header-row">
              <h3 class="sc-title"><a href="slab.html?id=${encodeURIComponent(s.id)}">${s.name}</a></h3>
              <span class="sc-gt-pill">${s.gtNumber || "GT-Stock"}</span>
            </div>
            <div class="sc-meta">${s.typeLabel || (typeVal === "engineered" ? "Engineered Surface" : "Natural Stone")} · ${s.origin || "Direct Import"}</div>
          </div>
          
          <div class="slab-key-specs">
            <div class="spec-col">
              <span class="spec-lbl">Lot Code</span>
              <span class="spec-val highlight">#${cleanLot}</span>
            </div>
            <div class="spec-col">
              <span class="spec-lbl">Calibration</span>
              <span class="spec-val">${s.thickness || "2 cm · 3 cm"}</span>
            </div>
            <div class="spec-col">
              <span class="spec-lbl">Net Size</span>
              <span class="spec-val">${cleanSize}</span>
            </div>
            <div class="spec-col">
              <span class="spec-lbl">Surface</span>
              <span class="spec-val">${s.finish || "Polished"}</span>
            </div>
          </div>

          <p class="sc-desc">${s.description || ""}</p>
          
          <div class="sc-specs">
            <span class="spec-pill">${appPill1}</span>
            <span class="spec-pill">${appPill2}</span>
            <span class="spec-pill">${charPill}</span>
          </div>

          <div class="sc-actions">
            <a href="slab.html?id=${encodeURIComponent(s.id)}" class="btn btn-sm btn-primary sc-action-inspect">
              <span>View Slab Details</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            </a>
            <a href="contact.html?stone=${encodeURIComponent(s.name)}&gt=${encodeURIComponent(s.gtNumber || '')}" class="btn btn-sm btn-secondary sc-action-hold" title="Reserve 48-hour trade hold on ${s.name}">
              <span>Place 48h Hold</span>
            </a>
          </div>
        </div>
      `;

      if (emptyEl) {
        slabGrid.insertBefore(card, emptyEl);
      } else {
        slabGrid.appendChild(card);
      }
    });

    if (window.GranTradeFavorites && typeof window.GranTradeFavorites.sync === "function") {
      window.GranTradeFavorites.sync();
    }
  }

  const cards = Array.from(slabGrid.querySelectorAll(".slab-card"));
  // Tag original index for "featured" restore
  cards.forEach((card, idx) => card.setAttribute("data-idx", idx));

  const emptyMsg = document.getElementById("slabEmpty");
  const resultCount = document.getElementById("resultCount");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const collCount = document.getElementById("collCount");

  // Search inputs & clear buttons (Hero search + Filter bar search)
  const heroSearchInput = document.getElementById("catalogSearchHero");
  const heroSearchClear = document.getElementById("searchHeroClearBtn");
  const filterSearchInput = document.getElementById("catalogSearch");
  const filterSearchClear = document.getElementById("searchClearBtn");
  const quickChips = Array.from(document.querySelectorAll(".quick-chip"));
  const heroSearchForm = document.getElementById("catalogSearchForm");

  // Filter dropdown controls
  const selColor = document.getElementById("filterColor");
  const selType = document.getElementById("filterType");
  const selFinish = document.getElementById("filterFinish");
  const selThickness = document.getElementById("filterThickness");
  const selSort = document.getElementById("sortBy");

  // Active filters bar & view mode controls
  const activeFiltersBar = document.getElementById("activeFiltersBar");
  const activeChipsList = document.getElementById("activeChipsList");
  const clearAllFiltersBtn = document.getElementById("clearAllFiltersBtn");
  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewListBtn = document.getElementById("viewListBtn");

  let currentCategory = "all";

  const CATEGORY_LABELS = {
    all: "All Stones",
    quartzite: "Exotic Quartzite",
    quartz: "Gran Trade Quartz",
    granite: "Natural Granite",
    marble: "Fine Marble",
    monuments: "Monuments",
    soapstone: "Soapstone",
    semi: "Semi Precious",
    tile: "Tile"
  };

  function getSearchQuery() {
    if (heroSearchInput && heroSearchInput.value.trim()) {
      return heroSearchInput.value.trim().toLowerCase();
    }
    if (filterSearchInput && filterSearchInput.value.trim()) {
      return filterSearchInput.value.trim().toLowerCase();
    }
    return "";
  }

  function setSearchQuery(val) {
    if (heroSearchInput) heroSearchInput.value = val;
    if (filterSearchInput) filterSearchInput.value = val;
    updateClearButtons(val);
    updateQuickChips(val);
  }

  function updateClearButtons(val) {
    const hasText = Boolean(val && val.trim().length > 0);
    if (heroSearchClear) heroSearchClear.style.display = hasText ? "block" : "none";
    if (filterSearchClear) filterSearchClear.style.display = hasText ? "block" : "none";
  }

  function updateQuickChips(val) {
    const qLower = (val || "").trim().toLowerCase();
    quickChips.forEach((chip) => {
      const chipVal = (chip.getAttribute("data-query") || chip.textContent).trim().toLowerCase();
      const isActive = Boolean(
        qLower && (
          chipVal === qLower ||
          (qLower.length >= 3 && chipVal.includes(qLower)) ||
          (chipVal.length >= 3 && qLower.includes(chipVal))
        )
      );
      chip.classList.toggle("active", isActive);
    });
  }

  function parseThickness(card) {
    const raw = (card.getAttribute("data-thickness") || "").trim();
    if (raw === "tile") return 1.2;
    const parts = raw
      .split(/\s+/)
      .map((x) => parseFloat(x))
      .filter((n) => !isNaN(n));
    return parts.length ? Math.max(...parts) : 0;
  }

  function matchesCard(card) {
    // 0. Live Search & Custom Hidden Tags Check
    const q = getSearchQuery();
    if (q) {
      const name = (card.getAttribute("data-name") || "").toLowerCase();
      const gt = (card.getAttribute("data-gt") || "").toLowerCase();
      const lot = (card.getAttribute("data-lot") || "").toLowerCase();
      const customTags = (card.getAttribute("data-tags") || "").toLowerCase();
      const cat = (card.getAttribute("data-cat") || "").toLowerCase();
      const meta = (card.getAttribute("data-meta") || "").toLowerCase();
      const hiddenTagsEl = card.querySelector(".sc-tags-hidden");
      const hiddenTags = hiddenTagsEl ? hiddenTagsEl.textContent.toLowerCase() : "";
      const desc = (card.querySelector(".sc-desc")?.textContent || "").toLowerCase();

      // Concatenate all searchable text and hidden tags for this post
      const haystack = `${name} ${gt} ${lot} ${customTags} ${hiddenTags} ${cat} ${meta} ${desc}`;
      const queryTerms = q.split(/\s+/).filter(Boolean);
      const matchesQuery = queryTerms.every((term) => haystack.includes(term));
      if (!matchesQuery) return false;
    }

    // 1. Category check
    const cat = card.getAttribute("data-cat");
    if (currentCategory !== "all" && cat !== currentCategory) {
      return false;
    }

    // 2. Color check
    const colorVal = selColor ? selColor.value : "all";
    if (colorVal !== "all") {
      const colors = (card.getAttribute("data-color") || "").split(/\s+/);
      if (!colors.includes(colorVal)) return false;
    }

    // 3. Type check (natural vs engineered)
    const typeVal = selType ? selType.value : "all";
    if (typeVal !== "all" && card.getAttribute("data-type") !== typeVal) {
      return false;
    }

    // 4. Finish check
    const finishVal = selFinish ? selFinish.value : "all";
    if (finishVal !== "all" && card.getAttribute("data-finish") !== finishVal) {
      return false;
    }

    // 5. Thickness check
    const thickVal = selThickness ? selThickness.value : "all";
    if (thickVal !== "all") {
      const thicknesses = (card.getAttribute("data-thickness") || "").split(/\s+/);
      if (!thicknesses.includes(thickVal)) return false;
    }

    return true;
  }

  function applyFiltersAndSort() {
    const q = getSearchQuery();
    updateClearButtons(q);
    updateQuickChips(q);

    const sortVal = selSort ? selSort.value : "featured";
    const sorted = [...cards];

    if (sortVal === "name-az") {
      sorted.sort((a, b) => a.getAttribute("data-name").localeCompare(b.getAttribute("data-name")));
    } else if (sortVal === "name-za") {
      sorted.sort((a, b) => b.getAttribute("data-name").localeCompare(a.getAttribute("data-name")));
    } else if (sortVal === "gt-asc") {
      sorted.sort((a, b) => (a.getAttribute("data-gt") || "").localeCompare(b.getAttribute("data-gt") || ""));
    } else if (sortVal === "thick-desc") {
      sorted.sort(
        (a, b) => parseThickness(b) - parseThickness(a) || a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"))
      );
    } else if (sortVal === "thick-asc") {
      sorted.sort(
        (a, b) => parseThickness(a) - parseThickness(b) || a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"))
      );
    } else if (sortVal === "cat-az") {
      sorted.sort(
        (a, b) => a.getAttribute("data-cat").localeCompare(b.getAttribute("data-cat")) || a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"))
      );
    } else {
      // Default / featured: original order
      sorted.sort((a, b) => parseInt(a.getAttribute("data-idx"), 10) - parseInt(b.getAttribute("data-idx"), 10));
    }

    // Re-attach sorted elements
    sorted.forEach((card) => slabGrid.appendChild(card));
    if (emptyMsg) slabGrid.appendChild(emptyMsg);

    // Apply visibility filter
    let visibleCount = 0;
    cards.forEach((card) => {
      const show = matchesCard(card);
      card.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    // Empty state
    if (emptyMsg) {
      emptyMsg.style.display = visibleCount === 0 ? "block" : "none";
    }

    // Results count & concise, non-repetitive copy
    if (collCount) {
      if (currentCategory === "all" && !q && (!selColor || selColor.value === "all") && (!selType || selType.value === "all") && (!selFinish || selFinish.value === "all") && (!selThickness || selThickness.value === "all")) {
        collCount.textContent = `${cards.length} Architectural Slabs Staged`;
      } else {
        collCount.textContent = `Displaying ${visibleCount} of ${cards.length} Materials`;
      }
    }

    if (resultCount) {
      resultCount.textContent = "";
    }

    // Render active filter chips rail
    renderActiveFilters();

    // Synchronize with tabs counter
    if (window.GranTradeTabs && typeof window.GranTradeTabs.updateCountDisplay === "function") {
      window.GranTradeTabs.updateCountDisplay(visibleCount, cards.length);
    }
  }

  function renderActiveFilters() {
    if (!activeFiltersBar || !activeChipsList) return;
    activeChipsList.innerHTML = "";

    const activeList = [];
    const q = getSearchQuery();
    if (q) {
      activeList.push({
        label: `Search: "${q}"`,
        clear: () => { setSearchQuery(""); applyFiltersAndSort(); }
      });
    }

    if (currentCategory !== "all") {
      activeList.push({
        label: `Category: ${CATEGORY_LABELS[currentCategory] || currentCategory}`,
        clear: () => {
          if (window.GranTradeTabs && typeof window.GranTradeTabs.setCategory === "function") {
            window.GranTradeTabs.setCategory("all");
          } else {
            currentCategory = "all";
            applyFiltersAndSort();
          }
        }
      });
    }

    if (selColor && selColor.value !== "all") {
      const text = selColor.options[selColor.selectedIndex]?.text || selColor.value;
      activeList.push({
        label: text,
        clear: () => { selColor.value = "all"; applyFiltersAndSort(); }
      });
    }

    if (selType && selType.value !== "all") {
      const text = selType.options[selType.selectedIndex]?.text || selType.value;
      activeList.push({
        label: text,
        clear: () => { selType.value = "all"; applyFiltersAndSort(); }
      });
    }

    if (selFinish && selFinish.value !== "all") {
      const text = selFinish.options[selFinish.selectedIndex]?.text || selFinish.value;
      activeList.push({
        label: text,
        clear: () => { selFinish.value = "all"; applyFiltersAndSort(); }
      });
    }

    if (selThickness && selThickness.value !== "all") {
      const text = selThickness.options[selThickness.selectedIndex]?.text || selThickness.value;
      activeList.push({
        label: text,
        clear: () => { selThickness.value = "all"; applyFiltersAndSort(); }
      });
    }

    if (activeList.length === 0) {
      activeFiltersBar.style.display = "none";
      return;
    }

    activeFiltersBar.style.display = "flex";
    activeList.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "active-filter-chip";
      chip.innerHTML = `
        <span>${item.label}</span>
        <button type="button" class="active-filter-remove" aria-label="Remove filter ${item.label}">&times;</button>
      `;
      chip.querySelector(".active-filter-remove").addEventListener("click", item.clear);
      activeChipsList.appendChild(chip);
    });
  }

  // Exposed API
  window.GranTradeFilters = {
    filterByCategory: function (catKey) {
      currentCategory = catKey;
      applyFiltersAndSort();
    },

    applySearch: function () {
      applyFiltersAndSort();
      const firstCard = slabGrid.querySelector(".slab-card");
      if (firstCard && firstCard.style.display !== "none") {
        firstCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    resetAll: function () {
      currentCategory = "all";
      setSearchQuery("");
      if (selColor) selColor.value = "all";
      if (selType) selType.value = "all";
      if (selFinish) selFinish.value = "all";
      if (selThickness) selThickness.value = "all";
      if (selSort) selSort.value = "featured";

      if (window.GranTradeTabs && typeof window.GranTradeTabs.setCategory === "function") {
        window.GranTradeTabs.setCategory("all");
      } else {
        applyFiltersAndSort();
      }
    },
  };

  // Wire Hero Search Input
  if (heroSearchInput) {
    heroSearchInput.addEventListener("input", function () {
      if (filterSearchInput) filterSearchInput.value = heroSearchInput.value;
      applyFiltersAndSort();
    });
    heroSearchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setSearchQuery("");
        applyFiltersAndSort();
      }
    });
  }

  // Wire Filter Bar Search Input
  if (filterSearchInput) {
    filterSearchInput.addEventListener("input", function () {
      if (heroSearchInput) heroSearchInput.value = filterSearchInput.value;
      applyFiltersAndSort();
    });
    filterSearchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setSearchQuery("");
        applyFiltersAndSort();
      }
    });
  }

  // Wire Clear Buttons
  [heroSearchClear, filterSearchClear].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", function () {
        setSearchQuery("");
        if (heroSearchInput) heroSearchInput.focus();
        else if (filterSearchInput) filterSearchInput.focus();
        applyFiltersAndSort();
      });
    }
  });

  // Wire Quick Chips
  quickChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      const query = this.getAttribute("data-query") || this.textContent.trim();
      const current = getSearchQuery();
      if (current === query.toLowerCase()) {
        // Toggle off if already active
        setSearchQuery("");
      } else {
        setSearchQuery(query);
      }
      applyFiltersAndSort();
    });
  });

  // Wire Search Form Submit
  if (heroSearchForm) {
    heroSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.GranTradeFilters.applySearch();
    });
  }

  // Wire Filter Dropdowns
  [selColor, selType, selFinish, selThickness, selSort].forEach((sel) => {
    if (sel) sel.addEventListener("change", applyFiltersAndSort);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", window.GranTradeFilters.resetAll);
  }

  // Wire Active Filters Bar Clear All Button
  if (clearAllFiltersBtn) {
    clearAllFiltersBtn.addEventListener("click", window.GranTradeFilters.resetAll);
  }

  // View Mode Switcher (Grid vs Manifest List)
  function setCatalogViewMode(mode) {
    if (!slabGrid) return;
    const isList = mode === "list";
    if (isList) {
      slabGrid.classList.add("is-list-view");
      if (viewListBtn) {
        viewListBtn.classList.add("active");
        viewListBtn.setAttribute("aria-pressed", "true");
      }
      if (viewGridBtn) {
        viewGridBtn.classList.remove("active");
        viewGridBtn.setAttribute("aria-pressed", "false");
      }
    } else {
      slabGrid.classList.remove("is-list-view");
      if (viewGridBtn) {
        viewGridBtn.classList.add("active");
        viewGridBtn.setAttribute("aria-pressed", "true");
      }
      if (viewListBtn) {
        viewListBtn.classList.remove("active");
        viewListBtn.setAttribute("aria-pressed", "false");
      }
    }
    try {
      localStorage.setItem("granTrade_catalog_view", isList ? "list" : "grid");
    } catch (_) {}
  }

  if (viewGridBtn) {
    viewGridBtn.addEventListener("click", function () {
      setCatalogViewMode("grid");
    });
  }
  if (viewListBtn) {
    viewListBtn.addEventListener("click", function () {
      setCatalogViewMode("list");
    });
  }

  // Restore saved view preference
  try {
    const savedView = localStorage.getItem("granTrade_catalog_view");
    if (savedView === "list") {
      setCatalogViewMode("list");
    }
  } catch (_) {}

  // Global Keyboard Shortcut: Press "/" to focus catalog search
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      if (heroSearchInput) {
        heroSearchInput.focus();
        heroSearchInput.select();
      } else if (filterSearchInput) {
        filterSearchInput.focus();
        filterSearchInput.select();
      }
    }
  });

  // Initial Run: Check URL Query params (?q=... or ?search=... or ?category=...)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || urlParams.get("search");
  if (initialQuery) {
    setSearchQuery(initialQuery);
  }

  const paramCategory = urlParams.get("category") || window.location.hash.replace("#", "");
  const validCategories = ["quartz", "granite", "marble", "quartzite", "monuments", "semi", "soapstone", "tile"];

  if (paramCategory && validCategories.includes(paramCategory)) {
    if (window.GranTradeTabs && typeof window.GranTradeTabs.setCategory === "function") {
      window.GranTradeTabs.setCategory(paramCategory);
    } else {
      currentCategory = paramCategory;
      applyFiltersAndSort();
    }
  } else {
    applyFiltersAndSort();
  }
})();
