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
        <a href="slab.html?id=${encodeURIComponent(s.id)}" target="_blank" rel="noopener noreferrer" class="sc-link-wrap" aria-label="Inspect ${s.name} slab in new tab" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
          <div class="sc-media">
            <span class="cat-badge">${s.categoryLabel || s.category}</span>
            <button class="heart" type="button" aria-label="Save ${s.name} to favorites" onclick="event.preventDefault(); event.stopPropagation();">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            </button>
            <img src="${s.image1 || ('assets/images/stone-types/' + s.category + '.jpg')}" alt="${s.name} wholesale stone slab" loading="lazy" onerror="this.onerror=null; this.src='assets/images/stone-types/${s.category}.jpg';" />
            <div class="sc-newtab-hint">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
              <span>Opens in New Tab</span>
            </div>
          </div>
          <div class="sc-body">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
              <h3 class="sc-title" style="margin-bottom:0;">${s.name}</h3>
              <span class="stock-badge" style="font-size:0.75rem; color:#2b7a4b; font-weight:700; background:rgba(43,122,75,0.12); padding:3px 9px; border-radius:999px;">● In Stock</span>
            </div>
            <div class="sc-meta">${s.categoryLabel || s.category} · ${s.origin || "Imported"}</div>
            
            <div class="slab-key-specs" style="margin:0.85rem 0; padding:0.75rem; background:var(--bg); border:1px solid var(--line); border-radius:var(--radius-sm); display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.78rem;">
              <div><span style="color:var(--muted); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.04em; display:block;">GT Number</span><strong style="color:var(--accent); font-size:0.95rem;">${s.gtNumber || "GT-Pending"}</strong></div>
              <div><span style="color:var(--muted); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.04em; display:block;">Lot Number</span><strong style="color:var(--ink); font-size:0.95rem;">${s.lotNumber || "LOT #Stock"}</strong></div>
              <div><span style="color:var(--muted); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.04em; display:block;">Thickness</span><strong style="color:var(--ink);">${s.thickness || "2 cm · 3 cm"}</strong></div>
              <div><span style="color:var(--muted); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.04em; display:block;">Size</span><strong style="color:var(--ink);">${s.size || "Full Slab"}</strong></div>
            </div>

            <p class="sc-desc">${s.description || ""}</p>
            
            <div class="sc-specs" style="margin-top:auto; padding-top:0.5rem;">
              <span class="spec-pill">${s.finish || "Polished"}</span>
              <span class="spec-pill">${s.typeLabel || (typeVal === "engineered" ? "Engineered Quartz" : "Natural Stone")}</span>
              <span class="spec-pill">${s.colorLabel || "Calibrated"}</span>
            </div>

            <div style="margin-top:1rem;">
              <span class="btn btn-sm btn-primary btn-block" style="display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                <span>Inspect Slab in New Tab</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
              </span>
            </div>
          </div>
        </a>
      `;

      if (emptyEl) {
        slabGrid.insertBefore(card, emptyEl);
      } else {
        slabGrid.appendChild(card);
      }
    });
  }

  const cards = Array.from(slabGrid.querySelectorAll(".slab-card"));
  // Tag original index for "featured" restore
  cards.forEach((card, idx) => card.setAttribute("data-idx", idx));

  const emptyMsg = document.getElementById("slabEmpty");
  const resultCount = document.getElementById("resultCount");
  const resetBtn = document.getElementById("resetFiltersBtn");

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

  let currentCategory = "all";

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

    // Results count
    if (resultCount) {
      resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "stone available" : "stones available"}`;
    }

    // Synchronize with tabs counter
    if (window.GranTradeTabs && typeof window.GranTradeTabs.updateCountDisplay === "function") {
      window.GranTradeTabs.updateCountDisplay(visibleCount, cards.length);
    }
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
