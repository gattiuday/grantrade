/**
 * GRAN TRADE INC. — 3-PICTURE STONE VIEWER MODULE (4/5)
 * Job: 3-view switcher (Slab view, Close-up detail, Installed view), zoom toggle, category sync
 */

(function () {
  "use strict";

  const VIEW_LABELS = ["Slab view", "Close-up detail", "Installed view"];

  // Default featured stone references by category
  const FEATURED_STONES = {
    all: "quartzite",
    quartz: {
      name: "Calacatta Alps",
      cat: "Gran Trade Quartz",
      desc: "Engineered quartz with crystalline alpine grey veining over clean porcelain white.",
      img: "assets/images/stone-types/quartz.jpg",
      room: "assets/images/stone-types/quartz.jpg",
    },
    granite: {
      name: "Absolute Black Polished",
      cat: "Natural Granite",
      desc: "Deep, dense igneous granite with mirror-like polish and unmatched durability.",
      img: "assets/images/stone-types/granite.jpg",
      room: "assets/images/stone-types/granite.jpg",
    },
    marble: {
      name: "Bianco Carrara",
      cat: "Fine Marble",
      desc: "Classic Italian metamorphic marble with delicate feathery veining.",
      img: "assets/images/stone-types/marble.jpg",
      room: "assets/images/stone-types/marble.jpg",
    },
    monuments: {
      name: "GT 001",
      cat: "Monuments",
      desc: "Fine-grain monument-grade black granite engineered for permanent outdoor longevity.",
      img: "assets/images/stone-types/monuments.jpg",
      room: "assets/images/stone-types/monuments.jpg",
    },
    quartzite: {
      name: "Aquamarine Quartzite",
      cat: "Exotic Quartzite",
      desc: "Signature exotic Brazilian slab surging with oceanic teal-green crystalline currents.",
      img: "assets/images/aquamarine-slab-1.jpg",
      room: "assets/images/aquamarine-slab-2.jpg",
    },
    semi: {
      name: "Semi Precious Stone – Blue Agate",
      cat: "Semi Precious Stone",
      desc: "Rare hand-composed mosaic of genuine blue agate geodes bound in optical resin.",
      img: "assets/images/stone-types/semi-precious.jpg",
      room: "assets/images/stone-types/semi-precious.jpg",
    },
    soapstone: {
      name: "Graphite Soapstone",
      cat: "Natural Soapstone",
      desc: "Silky matte charcoal soapstone impervious to kitchen acids, oils, and high heat.",
      img: "assets/images/stone-types/soapstone.jpg",
      room: "assets/images/stone-types/soapstone.jpg",
    },
    tile: {
      name: "Travertino Classico",
      cat: "Architectural Tile",
      desc: "Classic Roman travertine tiles celebrating warm natural cavities and earth tones.",
      img: "assets/images/stone-types/tile.jpg",
      room: "assets/images/stone-types/tile.jpg",
    },
  };

  function initViewer(rootId) {
    const root = document.getElementById(rootId);
    if (!root) return null;

    const imgEl = root.querySelector(".fv-stage img");
    const tagEl = root.querySelector(".fv-tag");
    const nameEl = root.querySelector(".fv-name");
    const catEl = root.querySelector(".fv-cat");
    const descEl = root.querySelector(".fv-desc");
    const optButtons = Array.from(root.querySelectorAll(".fv-opt"));

    let currentStone = null;
    let currentView = 0; // 0=slab, 1=closeup (zoom), 2=installed

    const stageEl = root.querySelector(".fv-stage");

    function render() {
      if (!currentStone || !imgEl) return;

      // Swap image source based on view mode
      if (currentView === 2 && currentStone.room) {
        imgEl.src = currentStone.room;
      } else {
        imgEl.src = currentStone.img;
      }

      // Handle close-up zoom transform & cursor state
      const isZoomed = currentView === 1;
      imgEl.classList.toggle("fv-zoom", isZoomed);
      if (stageEl) {
        stageEl.classList.toggle("is-zoomed", isZoomed);
      }
      if (!isZoomed && imgEl) {
        imgEl.style.transformOrigin = "center center";
      }

      imgEl.alt = `${currentStone.name} — ${VIEW_LABELS[currentView]}`;

      if (tagEl) tagEl.textContent = VIEW_LABELS[currentView];
      if (nameEl) nameEl.textContent = currentStone.name;
      if (catEl) catEl.textContent = currentStone.cat;
      if (descEl && currentStone.desc) descEl.textContent = currentStone.desc;

      // Update ARIA pressed state
      optButtons.forEach((btn, idx) => {
        btn.setAttribute("aria-pressed", idx === currentView ? "true" : "false");
      });
    }

    // Button event listeners
    optButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        currentView = parseInt(btn.getAttribute("data-view"), 10) || 0;
        render();
      });
    });

    // Touch/click directly on stage toggles zoom macro view
    if (stageEl) {
      stageEl.addEventListener("click", function () {
        currentView = currentView === 1 ? 0 : 1;
        render();
      });

      // Smooth cursor-following macro zoom on hover
      stageEl.addEventListener("mousemove", function (e) {
        if (currentView !== 1 || !imgEl) return;
        const rect = stageEl.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        imgEl.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
      });

      stageEl.addEventListener("mouseleave", function () {
        if (imgEl) {
          imgEl.style.transformOrigin = "center center";
        }
      });
    }

    const instance = {
      setCategory: function (catKey) {
        let entry = FEATURED_STONES[catKey];
        if (typeof entry === "string") {
          entry = FEATURED_STONES[entry];
        }
        if (!entry) entry = FEATURED_STONES.quartzite;

        currentStone = entry;
        currentView = 0;
        render();
      },

      setStone: function (stoneObj) {
        if (!stoneObj) return;
        currentStone = {
          name: stoneObj.name,
          cat: stoneObj.categoryLabel || stoneObj.category,
          desc: stoneObj.description,
          img: stoneObj.image,
          room: stoneObj.roomImage || "assets/images/applied-kitchen.jpg",
        };
        currentView = 0;
        render();
      },
    };

    // Default to 'all' (quartzite)
    instance.setCategory("all");
    return instance;
  }

  // Initialize viewer on DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    const mainViewer = initViewer("featuredViewer");
    if (mainViewer) {
      window.GranTradeViewer = mainViewer;
    }
  });
})();
