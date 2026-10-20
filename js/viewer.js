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
      img: "assets/images/products/calacatta-alps.jpg",
      room: "assets/images/applied-kitchen.jpg",
    },
    granite: {
      name: "Absolute Black Polished",
      cat: "Natural Granite",
      desc: "Deep, dense igneous granite with mirror-like polish and unmatched durability.",
      img: "assets/images/products/absolute-black-polished.jpg",
      room: "assets/images/applied-kitchen.jpg",
    },
    marble: {
      name: "Bianco Carrara",
      cat: "Fine Marble",
      desc: "Classic Italian metamorphic marble with delicate feathery veining.",
      img: "assets/images/products/bianco-carrara.jpg",
      room: "assets/images/applied-kitchen.jpg",
    },
    monuments: {
      name: "GT 001",
      cat: "Monuments",
      desc: "Fine-grain monument-grade black granite engineered for permanent outdoor longevity.",
      img: "assets/images/products/gt-001.png",
      room: "assets/images/why-yard.webp",
    },
    quartzite: {
      name: "Aquamarine Quartzite",
      cat: "Exotic Quartzite",
      desc: "Signature exotic Brazilian slab surging with oceanic teal-green crystalline currents.",
      img: "assets/images/products/aquamarine-quartzite.webp",
      room: "assets/images/applied-kitchen.jpg",
    },
    semi: {
      name: "Semi Precious Stone – Blue Agate",
      cat: "Semi Precious Stone",
      desc: "Rare hand-composed mosaic of genuine blue agate geodes bound in optical resin.",
      img: "assets/images/products/semi-precious-stone.jpg",
      room: "assets/images/applied-kitchen.jpg",
    },
    soapstone: {
      name: "Graphite Soapstone",
      cat: "Natural Soapstone",
      desc: "Silky matte charcoal soapstone impervious to kitchen acids, oils, and high heat.",
      img: "assets/images/products/graphite.webp",
      room: "assets/images/applied-kitchen.jpg",
    },
    tile: {
      name: "Travertino Classico",
      cat: "Architectural Tile",
      desc: "Classic Roman travertine tiles celebrating warm natural cavities and earth tones.",
      img: "assets/images/products/travertino-classico.webp",
      room: "assets/images/applied-kitchen.jpg",
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

    function render() {
      if (!currentStone || !imgEl) return;

      // Swap image source based on view mode
      if (currentView === 2 && currentStone.room) {
        imgEl.src = currentStone.room;
      } else {
        imgEl.src = currentStone.img;
      }

      // Handle close-up zoom transform
      imgEl.classList.toggle("fv-zoom", currentView === 1);
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
    const stageEl = root.querySelector(".fv-stage");
    if (stageEl) {
      stageEl.addEventListener("click", function () {
        currentView = currentView === 1 ? 0 : 1;
        render();
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
