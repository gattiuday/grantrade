/**
 * GRAN TRADE INC. — SEARCH, FILTERS & SORT ENGINE (3/5)
 * Job: Prominent hero search, live text search, quick search chips, URL ?q= query handling,
 * multi-facet catalog filtering, custom post tags inspection, dynamic sorting, count & empty state
 */

(function () {
  "use strict";

  const slabGrid = document.getElementById("slabGrid");
  if (!slabGrid) return;

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
      chip.classList.toggle("active", Boolean(qLower && chipVal === qLower));
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
