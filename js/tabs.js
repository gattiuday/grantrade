/**
 * GRAN TRADE INC. — TABS MODULE (2/5)
 * Job: Stone family category switching, count updating, viewer coordination
 */

(function () {
  "use strict";

  const tabContainer = document.querySelector(".coll-tabs");
  if (!tabContainer) return;

  const tabs = Array.from(tabContainer.querySelectorAll(".tab-btn[data-category]"));
  const countDisplay = document.getElementById("collCount");

  window.GranTradeTabs = {
    getActiveCategory: function () {
      const activeTab = tabs.find((t) => t.getAttribute("aria-pressed") === "true");
      return activeTab ? activeTab.getAttribute("data-category") : "all";
    },

    setCategory: function (categoryKey) {
      tabs.forEach(function (tab) {
        const matches = tab.getAttribute("data-category") === categoryKey;
        tab.setAttribute("aria-pressed", matches ? "true" : "false");
      });

      // Synchronize with filters module if present
      if (window.GranTradeFilters && typeof window.GranTradeFilters.filterByCategory === "function") {
        window.GranTradeFilters.filterByCategory(categoryKey);
      }

      // Synchronize with 3-picture viewer if present
      if (window.GranTradeViewer && typeof window.GranTradeViewer.setCategory === "function") {
        window.GranTradeViewer.setCategory(categoryKey);
      }
    },

    updateCountDisplay: function (visibleCount, totalCount) {
      if (!countDisplay) return;
      const activeCat = this.getActiveCategory();
      if (activeCat === "all") {
        countDisplay.textContent = `Showing all ${totalCount} stone slabs`;
      } else {
        countDisplay.textContent = `Showing ${visibleCount} of ${totalCount} slabs`;
      }
    },
  };

  // Click handler
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const cat = tab.getAttribute("data-category");
      window.GranTradeTabs.setCategory(cat);

      // Smooth scroll horizontally into view on small screens
      tab.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
  });

  // Keyboard navigation across tab rail
  tabContainer.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const currentIdx = tabs.findIndex((t) => t.getAttribute("aria-pressed") === "true");
      let nextIdx = currentIdx;

      if (e.key === "ArrowRight") {
        nextIdx = (currentIdx + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
      }

      tabs[nextIdx].focus();
      tabs[nextIdx].click();
    }
  });
})();
