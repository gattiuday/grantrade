/**
 * GRAN TRADE INC. — SEARCH, FILTERS & SORT ENGINE (3/5)
 * Job: Prominent hero search, live text search, quick search chips, URL ?q= query handling,
 * multi-facet catalog filtering, custom post tags inspection, dynamic sorting, count & empty state
 */

(function () {
  "use strict";

  const slabGrid = document.getElementById("slabGrid");
  if (!slabGrid) return;

  function wpAsset(path) {
    return window.GranTradeWP && typeof window.GranTradeWP.asset === "function"
      ? window.GranTradeWP.asset(path)
      : path;
  }

  function wpPage(href) {
    return window.GranTradeWP && typeof window.GranTradeWP.page === "function"
      ? window.GranTradeWP.page(href)
      : href;
  }

  if (window.GranTradeWP && typeof window.GranTradeWP.mergeWordPressStones === "function") {
    window.GranTradeWP.mergeWordPressStones();
  }

  const catalogRef = window.GRAN_TRADE_CATALOG;
  if (catalogRef && typeof catalogRef.applyLocalOverrides === "function") {
    catalogRef.applyLocalOverrides();
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeColors(input) {
    if (catalogRef && typeof catalogRef.normalizeColorTags === "function") {
      return catalogRef.normalizeColorTags(input);
    }
    const rawList = Array.isArray(input) ? input : String(input || "").split(/[,;|]+/);
    const seen = new Set();
    const out = [];
    rawList.forEach(function (item) {
      const clean = String(item || "").trim().toLowerCase().replace(/\s+/g, " ");
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        out.push(clean);
      }
    });
    return out;
  }

  function formatColorLabel(tag) {
    if (catalogRef && typeof catalogRef.formatColorLabel === "function") {
      return catalogRef.formatColorLabel(tag);
    }
    const clean = String(tag || "").trim().toLowerCase();
    return clean ? clean.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : "";
  }

  function getColorSwatch(tag) {
    if (catalogRef && typeof catalogRef.getColorSwatch === "function") {
      return catalogRef.getColorSwatch(tag);
    }
    return "#8b929a";
  }

  function cleanThicknessText(raw) {
    if (raw === null || raw === undefined) return "";
    const str = String(raw).trim();
    if (!str) return "";
    const val = (/calibrated/i.test(str)
      ? str.replace(/\b2\s*cm\s*·\s*3\s*cm/gi, "3 cm").replace(/\bcalibrated\b/gi, "")
      : str
    )
      .replace(/\s{2,}/g, " ")
      .replace(/\s*·\s*$/g, "")
      .trim();
    return val;
  }

  function stripHtmlTags(raw) {
    return String(raw || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  function extractFinishTokens(raw) {
    const cleaned = String(raw || "").toLowerCase().trim();
    if (!cleaned) return [];
    const tokens = new Set();
    const parts = cleaned
      .split(/[,;|\/·+&]+|\band\b/gi)
      .map((p) => p.trim())
      .filter(Boolean);

    parts.forEach(function (part) {
      tokens.add(part);
      const words = part.split(/\s+/).filter(Boolean);
      words.forEach((w) => tokens.add(w));
      if (part.includes("leather") || words.some((w) => w.startsWith("leather"))) {
        tokens.add("leather");
        tokens.add("leathered");
      }
      if (part.includes("polish") || words.some((w) => w.startsWith("polish"))) {
        tokens.add("polished");
      }
      if (part.includes("honed") || words.some((w) => w.startsWith("hone"))) {
        tokens.add("honed");
      }
      if (part.includes("brush")) tokens.add("brushed");
      if (part.includes("flame")) tokens.add("flamed");
      if (part.includes("satin")) tokens.add("satin");
      if (part.includes("matte")) tokens.add("matte");
    });

    return Array.from(tokens);
  }

  function extractThicknessTokens(raw) {
    const str = cleanThicknessText(raw).toLowerCase();
    if (!str) return [];
    const tokens = new Set();
    const cmMatches = str.match(/\b(\d+(?:\.\d+)?)\s*(?:cm|mm)?\b/g) || [];
    cmMatches.forEach(function (m) {
      const numMatch = m.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) tokens.add(numMatch[1]);
    });
    if (str.includes("tile")) tokens.add("tile");
    return Array.from(tokens);
  }

  function extractTypeToken(s) {
    const raw = String((s && s.type) || "").toLowerCase().trim();
    const lbl = String((s && s.typeLabel) || "").toLowerCase();
    if (raw === "engineered" || lbl.includes("engineered") || (raw === "" && s && s.category === "quartz")) {
      return "engineered";
    }
    return "natural";
  }

  function renderColorTagPillsHtml(colorsList, stoneName) {
    return colorsList
      .map(function (c) {
        const safeTag = escapeHtml(c);
        const safeLabel = escapeHtml(formatColorLabel(c));
        const swatch = escapeHtml(getColorSwatch(c));
        return `<button type="button" class="color-tag-pill" data-color-tag="${safeTag}" title="Filter by ${safeLabel}"><span class="color-tag-dot" style="background:${swatch};"></span><span>${safeLabel}</span></button>`;
      })
      .join("");
  }

  function hasGtForStone(s) {
    if (catalogRef && typeof catalogRef.hasGtNumber === "function") {
      return catalogRef.hasGtNumber(s);
    }
    const cat = String((s && s.category) || "").toLowerCase();
    return Boolean(s && s.gtNumber && cat !== "granite" && cat !== "quartzite" && cat !== "marble");
  }

  function buildSearchTags(s, colorsList, thicknessLabel, canonicalCatLabel, gtVal) {
    const colorKeys = colorsList.join(", ");
    const colorDisplayLabels = colorsList.map(formatColorLabel).join(", ");
    const extraTags = Array.isArray(s.tags) ? s.tags.join(", ") : String(s.tags || "");
    return [
      s.id,
      s.name,
      gtVal,
      s.lotNumber,
      s.category,
      canonicalCatLabel,
      s.type,
      s.typeLabel,
      s.origin,
      colorKeys,
      colorDisplayLabels,
      s.colorLabel,
      extraTags,
      s.finish,
      thicknessLabel,
      s.size,
      s.application,
      stripHtmlTags(s.description),
      stripHtmlTags(s.excerpt),
      stripHtmlTags(s.content)
    ].filter(Boolean).join(" ").toLowerCase();
  }

  let cards = [];

  // Dynamically populate/rebuild all catalog stones from GRAN_TRADE_CATALOG into the DOM grid
  function buildCatalogCards() {
    slabGrid.querySelectorAll(".slab-card").forEach((el) => el.remove());

    if (catalogRef && Array.isArray(catalogRef.all)) {
      const emptyEl = document.getElementById("slabEmpty");
      catalogRef.all.forEach(function (s) {
        const thicknessLabel = cleanThicknessText(s.thickness);
        const thicknessTokens = extractThicknessTokens(thicknessLabel);
        const thicknessVal = thicknessTokens.join(" ");
        const typeVal = extractTypeToken(s);
        const finishTokens = extractFinishTokens(s.finish);
        const finishVal = finishTokens.join("|");
        const backendTagColors = Array.isArray(s.tags) ? normalizeColors(s.tags) : normalizeColors(s.tags || "");
        const colorsList = normalizeColors(
          (Array.isArray(s.colors) ? s.colors : []).concat(backendTagColors)
        );
        const colorsPipe = colorsList.join("|");
        const colorsJoined = colorsList.join(", ");
        const showGt = hasGtForStone(s);
        const gtVal = showGt ? String(s.gtNumber).trim() : "";
        const canonicalCatLabel = (catalogRef && typeof catalogRef.getCategoryLabel === "function")
          ? catalogRef.getCategoryLabel(s.category, s.categoryLabel)
          : s.categoryLabel;
        const tagsVal = buildSearchTags(s, colorsList, thicknessLabel, canonicalCatLabel, gtVal);

        const card = document.createElement("article");
        card.className = "slab-card";
        card.setAttribute("data-id", s.id);
        card.setAttribute("data-cat", s.category);
        card.setAttribute("data-type", typeVal);
        card.setAttribute("data-color", colorsPipe);
        card.setAttribute("data-finish", finishVal);
        card.setAttribute("data-thickness", thicknessVal);
        card.setAttribute("data-name", s.name);
        card.setAttribute("data-gt", gtVal);
        card.setAttribute("data-lot", s.lotNumber || "");
        card.setAttribute("data-meta", `${canonicalCatLabel || s.category} · ${s.name}`);
        card.setAttribute("data-tags", tagsVal);

        const slabUrl = s.permalink || wpPage(`slab.html?id=${encodeURIComponent(s.id)}`);
        card.setAttribute("data-url", slabUrl);
        const imgUrl = wpAsset(s.image1 || (`assets/images/stone-types/${s.category}.jpg`));
        const fallbackUrl = wpAsset(`assets/images/stone-types/${s.category}.jpg`);
        const materialName = canonicalCatLabel || s.typeLabel || (typeVal === "engineered" ? "Engineered Quartz" : "Natural Stone");
        const gtPillHtml = showGt ? `<span class="sc-gt-pill">${escapeHtml(gtVal)}</span>` : "";

        card.innerHTML = `
          <div class="sc-tags-hidden" aria-hidden="true" style="display:none;">
            ${escapeHtml(tagsVal)}
          </div>
          <div class="sc-media">
            <button class="heart" type="button" aria-label="Save ${escapeHtml(s.name)} to favorites" onclick="event.preventDefault(); event.stopPropagation();">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            </button>
            <a href="${slabUrl}" class="sc-img-link" aria-label="Inspect ${escapeHtml(s.name)} details" style="display:block; width:100%; height:100%;">
              <img src="${imgUrl}" alt="${escapeHtml(s.name)} wholesale stone slab" loading="lazy" onerror="this.onerror=null; this.src='${fallbackUrl}';" />
            </a>
          </div>
          <div class="sc-body">
            <div class="sc-info-block">
              <div class="sc-header-row">
                <h3 class="sc-title"><a href="${slabUrl}">${escapeHtml(s.name)}</a></h3>
                ${gtPillHtml}
              </div>
              <div class="sc-meta sc-material-name">${escapeHtml(materialName)}</div>
            </div>

            <div class="sc-color-tags" aria-label="Color tags for ${escapeHtml(s.name)}">
              ${renderColorTagPillsHtml(colorsList, s.name)}
            </div>
          </div>
        `;

        if (emptyEl) {
          slabGrid.insertBefore(card, emptyEl);
        } else {
          slabGrid.appendChild(card);
        }
      });
    }

    cards = Array.from(slabGrid.querySelectorAll(".slab-card"));
    cards.forEach((card, idx) => card.setAttribute("data-idx", idx));

    if (window.GranTradeFavorites && typeof window.GranTradeFavorites.sync === "function") {
      window.GranTradeFavorites.sync();
    }
  }

  buildCatalogCards();

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
    quartzite: "Quartzite",
    quartz: "Quartz",
    granite: "Granite",
    marble: "Marble",
    monuments: "Monuments",
    soapstone: "Soapstone",
    semi: "Semi Precious",
    tile: "Tiles"
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

  function matchesCard(card, ignoreCategory) {
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

      const haystack = `${name} ${gt} ${lot} ${customTags} ${hiddenTags} ${cat} ${meta}`;
      const haystackCompact = haystack.replace(/[^a-z0-9]/g, "");
      const queryTerms = q.split(/\s+/).filter(Boolean);
      const matchesQuery = queryTerms.every((term) => {
        if (haystack.includes(term)) return true;
        const compactTerm = term.replace(/[^a-z0-9]/g, "");
        return Boolean(compactTerm && haystackCompact.includes(compactTerm));
      });
      if (!matchesQuery) return false;
    }

    // 1. Category check
    if (!ignoreCategory) {
      const cat = card.getAttribute("data-cat");
      if (currentCategory !== "all" && cat !== currentCategory) {
        return false;
      }
    }

    // 2. Color check
    const colorVal = selColor ? selColor.value : "all";
    if (colorVal !== "all") {
      const colors = normalizeColors(card.getAttribute("data-color") || "");
      if (!colors.includes(colorVal.toLowerCase())) return false;
    }

    // 3. Type check (natural vs engineered)
    const typeVal = selType ? selType.value : "all";
    if (typeVal !== "all" && card.getAttribute("data-type") !== typeVal) {
      return false;
    }

    // 4. Finish check (supports single or multi-finish backend strings like "Polished / Leathered")
    const finishVal = selFinish ? selFinish.value : "all";
    if (finishVal !== "all") {
      const targetFinish = finishVal.toLowerCase();
      const cardFinishes = (card.getAttribute("data-finish") || "").split("|").filter(Boolean);
      const matchesFinish = cardFinishes.includes(targetFinish) ||
        cardFinishes.some((f) => f.includes(targetFinish) || (targetFinish === "leather" && f.includes("leather")));
      if (!matchesFinish) return false;
    }

    // 5. Thickness check
    const thickVal = selThickness ? selThickness.value : "all";
    if (thickVal !== "all") {
      const thicknesses = (card.getAttribute("data-thickness") || "").split(/\s+/).filter(Boolean);
      if (!thicknesses.includes(thickVal)) return false;
    }

    return true;
  }

  function syncUrlState() {
    if (!window.history || typeof window.history.replaceState !== "function") return;
    try {
      const url = new URL(window.location.href);
      if (currentCategory && currentCategory !== "all") {
        url.searchParams.set("category", currentCategory);
      } else {
        url.searchParams.delete("category");
      }
      const rawQ = heroSearchInput && heroSearchInput.value.trim()
        ? heroSearchInput.value.trim()
        : (filterSearchInput && filterSearchInput.value.trim() ? filterSearchInput.value.trim() : "");
      if (rawQ) {
        url.searchParams.set("q", rawQ);
      } else {
        url.searchParams.delete("q");
      }
      url.searchParams.delete("search");
      window.history.replaceState(null, "", url.pathname + (url.search || "") + (url.hash || ""));
    } catch (_) {}
  }

  function updateTabCounts() {
    const tabBtns = document.querySelectorAll(".coll-tabs .tab-btn[data-category]");
    if (!tabBtns.length) return;

    const countsByCat = { all: 0 };
    cards.forEach((card) => {
      if (!matchesCard(card, true)) return;
      countsByCat.all += 1;
      const catKey = card.getAttribute("data-cat") || "";
      if (catKey) countsByCat[catKey] = (countsByCat[catKey] || 0) + 1;
    });

    tabBtns.forEach((btn) => {
      const catKey = btn.getAttribute("data-category");
      const countEl = btn.querySelector(".tab-count");
      if (countEl && catKey) {
        countEl.textContent = String(countsByCat[catKey] || 0);
      }
    });
  }

  function renderEmptyBoxState(visibleCount, q) {
    if (!emptyMsg) return;
    const existingWidenBtn = document.getElementById("widenSearchCategoryBtn");
    if (existingWidenBtn) existingWidenBtn.remove();

    if (cards.length === 0) {
      emptyMsg.style.display = "none";
      return;
    }

    emptyMsg.style.display = visibleCount === 0 ? "block" : "none";
    if (visibleCount !== 0) return;

    const headingEl = emptyMsg.querySelector("h3");
    const descEl = emptyMsg.querySelector("p");
    if (headingEl) headingEl.textContent = "No stone slabs found";
    if (descEl) descEl.textContent = "We couldn't find any stone slabs for your specific filter criteria. Try clearing some filters or search query.";
    if (resetBtn) resetBtn.style.display = "";

    const globalMatches = currentCategory !== "all"
      ? cards.filter((c) => matchesCard(c, true)).length
      : 0;

    if (globalMatches > 0 && resetBtn && resetBtn.parentNode) {
      const widenBtn = document.createElement("button");
      widenBtn.id = "widenSearchCategoryBtn";
      widenBtn.type = "button";
      widenBtn.className = "btn btn-secondary";
      widenBtn.style.marginRight = "0.5rem";
      widenBtn.textContent = q
        ? `Show ${globalMatches} "${q}" Match${globalMatches === 1 ? "" : "es"} in All Slabs`
        : `Show ${globalMatches} Match${globalMatches === 1 ? "" : "es"} in All Slabs`;
      widenBtn.addEventListener("click", function () {
        if (window.GranTradeTabs && typeof window.GranTradeTabs.setCategory === "function") {
          window.GranTradeTabs.setCategory("all");
        } else {
          currentCategory = "all";
          applyFiltersAndSort();
        }
      });
      resetBtn.parentNode.insertBefore(widenBtn, resetBtn);
    }
  }

  function applyFiltersAndSort() {
    const q = getSearchQuery();
    updateClearButtons(q);
    updateQuickChips(q);
    syncUrlState();

    const sortVal = selSort ? selSort.value : "featured";
    const sorted = [...cards];

    if (sortVal === "name-az") {
      sorted.sort((a, b) => a.getAttribute("data-name").localeCompare(b.getAttribute("data-name")));
    } else if (sortVal === "name-za") {
      sorted.sort((a, b) => b.getAttribute("data-name").localeCompare(a.getAttribute("data-name")));
    } else if (sortVal === "gt-asc") {
      sorted.sort((a, b) => {
        const ga = a.getAttribute("data-gt") || "\uffff";
        const gb = b.getAttribute("data-gt") || "\uffff";
        return ga.localeCompare(gb) || a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"));
      });
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

    // Empty state & dynamic tab counts
    renderEmptyBoxState(visibleCount, q);
    updateTabCounts();

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
        label: CATEGORY_LABELS[currentCategory] || currentCategory,
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
  function refreshCatalog() {
    if (catalogRef && typeof catalogRef.refresh === "function") {
      catalogRef.refresh();
    } else if (catalogRef && typeof catalogRef.applyLocalOverrides === "function") {
      catalogRef.applyLocalOverrides();
    }
    buildCatalogCards();
    syncColorFilterOptions();
    applyFiltersAndSort();
    if (window.GranTradeFavorites && typeof window.GranTradeFavorites.refresh === "function") {
      window.GranTradeFavorites.refresh();
    }
  }

  let isLoadingRemoteCatalog = false;
  async function loadRemoteBackendStones() {
    if (isLoadingRemoteCatalog || !catalogRef) return false;
    isLoadingRemoteCatalog = true;
    try {
      const env = window.GRAN_TRADE_ENV || {};
      if (env.isWordPress && env.ajaxUrl && typeof fetch === "function") {
        const sep = env.ajaxUrl.includes("?") ? "&" : "?";
        const res = await fetch(`${env.ajaxUrl}${sep}action=grantrade_get_catalog`, { cache: "no-store" });
        if (res.ok) {
          const payload = await res.json();
          if (payload && payload.success && payload.data && Array.isArray(payload.data.wpStones)) {
            if (typeof catalogRef.setExternalStones === "function") {
              catalogRef.setExternalStones(payload.data.wpStones, Boolean(payload.data.replaceBuiltinCatalog));
            }
            refreshCatalog();
            return true;
          }
        }
      }

      if (window.GranTradeDB && typeof window.GranTradeDB.isConnected === "function" && window.GranTradeDB.isConnected()) {
        const remoteStones = await window.GranTradeDB.fetchStones();
        if (Array.isArray(remoteStones) && remoteStones.length > 0 && typeof catalogRef.setExternalStones === "function") {
          catalogRef.setExternalStones(remoteStones, true);
          refreshCatalog();
          return true;
        }
      }
    } catch (err) {
      console.warn("[GranTrade] Backend catalog sync skipped:", err);
    } finally {
      isLoadingRemoteCatalog = false;
    }
    return false;
  }

  window.GranTradeFilters = {
    filterByCategory: function (catKey) {
      currentCategory = catKey;
      applyFiltersAndSort();
    },

    applySearch: function () {
      applyFiltersAndSort();
      const q = getSearchQuery();
      let firstVisible = cards.find((c) => c.style.display !== "none");
      if (!firstVisible && q && currentCategory !== "all" && cards.some((c) => matchesCard(c, true))) {
        if (window.GranTradeTabs && typeof window.GranTradeTabs.setCategory === "function") {
          window.GranTradeTabs.setCategory("all");
        } else {
          currentCategory = "all";
          applyFiltersAndSort();
        }
        firstVisible = cards.find((c) => c.style.display !== "none");
      }
      const scrollTarget = firstVisible || emptyMsg;
      if (scrollTarget && typeof scrollTarget.scrollIntoView === "function") {
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

    refresh: refreshCatalog,
    syncFromBackend: loadRemoteBackendStones,
  };

  // Wire Hero Search Input
  if (heroSearchInput) {
    const onHeroSearchChange = function () {
      if (filterSearchInput) filterSearchInput.value = heroSearchInput.value;
      applyFiltersAndSort();
    };
    heroSearchInput.addEventListener("input", onHeroSearchChange);
    heroSearchInput.addEventListener("search", onHeroSearchChange);
    heroSearchInput.addEventListener("change", onHeroSearchChange);
    heroSearchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setSearchQuery("");
        applyFiltersAndSort();
      }
    });
  }

  // Wire Filter Bar Search Input
  if (filterSearchInput) {
    const onFilterSearchChange = function () {
      if (heroSearchInput) heroSearchInput.value = filterSearchInput.value;
      applyFiltersAndSort();
    };
    filterSearchInput.addEventListener("input", onFilterSearchChange);
    filterSearchInput.addEventListener("search", onFilterSearchChange);
    filterSearchInput.addEventListener("change", onFilterSearchChange);
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

  // Dynamic Color Filter Options + Custom Color Tag Controls
  const toggleColorTagModeBtn = document.getElementById("toggleColorTagModeBtn");
  const colorTagsDatalist = document.getElementById("colorTagsDatalist");

  function syncColorFilterOptions() {
    if (!selColor && !colorTagsDatalist) return;
    const baseOrder = ["blue", "green", "white", "grey", "black", "gold", "cream", "brown", "red"];
    const tagSet = new Set(baseOrder);
    const extras = [];

    cards.forEach(function (card) {
      normalizeColors(card.getAttribute("data-color") || "").forEach(function (c) {
        if (!tagSet.has(c)) {
          tagSet.add(c);
          extras.push(c);
        }
      });
    });
    extras.sort(function (a, b) { return a.localeCompare(b); });
    const allTags = baseOrder.concat(extras);

    if (selColor) {
      const prevVal = selColor.value || "all";
      const opts = ['<option value="all">Color: All Colors</option>'];
      allTags.forEach(function (tag) {
        opts.push(`<option value="${escapeHtml(tag)}">${escapeHtml(formatColorLabel(tag))}</option>`);
      });
      selColor.innerHTML = opts.join("");
      selColor.value = allTags.includes(prevVal) ? prevVal : "all";
    }

    if (colorTagsDatalist) {
      colorTagsDatalist.innerHTML = allTags
        .map(function (tag) { return `<option value="${escapeHtml(formatColorLabel(tag))}"></option>`; })
        .join("");
    }

    syncFinishFilterOptions();
    syncThicknessFilterOptions();
  }

  function syncFinishFilterOptions() {
    if (!selFinish) return;
    const baseFinishes = [
      { value: "polished", label: "Polished" },
      { value: "leather", label: "Leathered" },
      { value: "honed", label: "Honed" }
    ];
    const baseKeys = new Set(["polished", "leather", "leathered", "honed"]);
    const extras = new Set();

    if (catalogRef && Array.isArray(catalogRef.all)) {
      catalogRef.all.forEach(function (s) {
        const raw = String((s && s.finish) || "");
        raw.split(/[,;|\/·+&]+/).forEach(function (part) {
          const clean = part.trim().toLowerCase();
          if (!clean || baseKeys.has(clean)) return;
          if (clean.includes("leather") || clean.includes("polish") || clean.includes("honed")) return;
          extras.add(clean);
        });
      });
    }

    const prevVal = selFinish.value || "all";
    const opts = ['<option value="all">Finish: All Finishes</option>'];
    const validVals = new Set(["all"]);
    baseFinishes.forEach(function (item) {
      opts.push(`<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`);
      validVals.add(item.value);
    });
    Array.from(extras)
      .sort(function (a, b) { return a.localeCompare(b); })
      .forEach(function (extraKey) {
        const label = formatColorLabel(extraKey);
        opts.push(`<option value="${escapeHtml(extraKey)}">${escapeHtml(label)}</option>`);
        validVals.add(extraKey);
      });

    selFinish.innerHTML = opts.join("");
    selFinish.value = validVals.has(prevVal) ? prevVal : "all";
  }

  function syncThicknessFilterOptions() {
    if (!selThickness) return;
    const foundNums = new Set();
    if (catalogRef && Array.isArray(catalogRef.all)) {
      catalogRef.all.forEach(function (s) {
        extractThicknessTokens(s && s.thickness).forEach(function (tok) {
          if (tok !== "tile") foundNums.add(tok);
        });
      });
    }

    const ordered = [];
    if (foundNums.has("3") || foundNums.size === 0) ordered.push("3");
    Array.from(foundNums)
      .filter((t) => t !== "3")
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .forEach((t) => ordered.push(t));

    const prevVal = selThickness.value || "all";
    const opts = ['<option value="all">Thickness: All</option>'];
    ordered.forEach(function (tok) {
      opts.push(`<option value="${escapeHtml(tok)}">${escapeHtml(tok)} cm</option>`);
    });
    selThickness.innerHTML = opts.join("");
    selThickness.value = ordered.includes(prevVal) ? prevVal : "all";
  }

  function updateCardColorTags(card, nextTags) {
    const stoneId = card.getAttribute("data-id");
    const stoneName = card.getAttribute("data-name") || "slab";
    const normalized = (catalogRef && typeof catalogRef.saveColorTags === "function")
      ? catalogRef.saveColorTags(stoneId, nextTags)
      : normalizeColors(nextTags);

    card.setAttribute("data-color", normalized.join("|"));
    const stoneObj = catalogRef && typeof catalogRef.getById === "function" ? catalogRef.getById(stoneId) : null;
    if (stoneObj) {
      stoneObj.colors = normalized.slice();
      const canonicalCatLabel = (catalogRef && typeof catalogRef.getCategoryLabel === "function")
        ? catalogRef.getCategoryLabel(stoneObj.category, stoneObj.categoryLabel)
        : stoneObj.categoryLabel;
      const gtVal = hasGtForStone(stoneObj) ? String(stoneObj.gtNumber).trim() : "";
      const thicknessLabel = cleanThicknessText(stoneObj.thickness);
      card.setAttribute("data-tags", buildSearchTags(stoneObj, normalized, thicknessLabel, canonicalCatLabel, gtVal));
    } else {
      const tagsJoined = normalized.concat(normalized.map(formatColorLabel)).join(", ");
      const prevTags = [
        stoneName,
        card.getAttribute("data-gt") || "",
        card.getAttribute("data-lot") || "",
        card.getAttribute("data-cat") || "",
        card.getAttribute("data-meta") || "",
        tagsJoined,
        card.getAttribute("data-finish") || ""
      ].filter(Boolean).join(" ").toLowerCase();
      card.setAttribute("data-tags", prevTags);
    }

    const pillsWrap = card.querySelector(".sc-color-tags");
    if (pillsWrap) {
      pillsWrap.innerHTML = renderColorTagPillsHtml(normalized, stoneName);
    }

    syncColorFilterOptions();
    applyFiltersAndSort();
  }

  if (toggleColorTagModeBtn) {
    toggleColorTagModeBtn.addEventListener("click", function () {
      const active = slabGrid.classList.toggle("is-tag-edit-mode");
      this.classList.toggle("active", active);
      this.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  slabGrid.addEventListener("click", function (e) {
    const removeBtn = e.target.closest("[data-remove-tag]");
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = removeBtn.closest(".slab-card");
      if (!card) return;
      const targetTag = removeBtn.getAttribute("data-remove-tag");
      const current = normalizeColors(card.getAttribute("data-color") || "");
      updateCardColorTags(card, current.filter(function (c) { return c !== targetTag; }));
      return;
    }

    const tagPill = e.target.closest(".color-tag-pill[data-color-tag]");
    if (tagPill) {
      e.preventDefault();
      e.stopPropagation();
      const tag = tagPill.getAttribute("data-color-tag");
      if (selColor) {
        selColor.value = selColor.value === tag ? "all" : tag;
        applyFiltersAndSort();
      } else {
        setSearchQuery(tag);
        applyFiltersAndSort();
      }
      return;
    }

    if (e.target.closest("a, button, input, form, .color-tag-editor, .sc-color-tags")) return;
    const card = e.target.closest(".slab-card[data-url]");
    if (card) {
      const targetUrl = card.getAttribute("data-url");
      if (targetUrl) window.location.href = targetUrl;
    }
  });

  slabGrid.addEventListener("submit", function (e) {
    const form = e.target.closest(".color-tag-editor");
    if (!form) return;
    e.preventDefault();
    const card = form.closest(".slab-card");
    const input = form.querySelector(".color-tag-input");
    if (!card || !input) return;
    const added = normalizeColors(input.value);
    if (!added.length) return;
    const current = normalizeColors(card.getAttribute("data-color") || "");
    updateCardColorTags(card, current.concat(added));
    input.value = "";
  });

  syncColorFilterOptions();

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

  // Hydrate live Supabase backend catalog when configured on static site
  if (window.GranTradeDB && typeof window.GranTradeDB.isConnected === "function" && window.GranTradeDB.isConnected()) {
    loadRemoteBackendStones();
  }

  window.addEventListener("storage", function (e) {
    if (e.key === "granTrade_stone_overrides_v1") {
      refreshCatalog();
    }
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      refreshCatalog();
    }
  });
})();
