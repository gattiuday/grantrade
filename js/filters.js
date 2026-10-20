/**
 * GRAN TRADE INC. — FILTERS & SORT MODULE (3/5)
 * Job: Multi-facet catalog filtering, sorting engine, dynamic count & empty state
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

  // Filter dropdown controls
  const selColor = document.getElementById("filterColor");
  const selType = document.getElementById("filterType");
  const selFinish = document.getElementById("filterFinish");
  const selThickness = document.getElementById("filterThickness");
  const selSort = document.getElementById("sortBy");

  let currentCategory = "all";

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
    const sortVal = selSort ? selSort.value : "featured";
    const sorted = [...cards];

    if (sortVal === "name-az") {
      sorted.sort((a, b) => a.getAttribute("data-name").localeCompare(b.getAttribute("data-name")));
    } else if (sortVal === "name-za") {
      sorted.sort((a, b) => b.getAttribute("data-name").localeCompare(a.getAttribute("data-name")));
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

  // Exposed API for tabs module
  window.GranTradeFilters = {
    filterByCategory: function (catKey) {
      currentCategory = catKey;
      applyFiltersAndSort();
    },

    resetAll: function () {
      currentCategory = "all";
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

  // Event Listeners for dropdowns
  [selColor, selType, selFinish, selThickness, selSort].forEach((sel) => {
    if (sel) sel.addEventListener("change", applyFiltersAndSort);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", window.GranTradeFilters.resetAll);
  }

  // Initial run
  applyFiltersAndSort();
})();
