/**
 * GRAN TRADE INC. — VERTICAL LIQUID FLOW STONE CATALOG & SCROLL POPUP SYSTEM
 * Features:
 * - Scroll-triggered organic liquid spring popups for vertical stone rows
 * - Interactive category filtering (Natural, Engineered, Heavy-Duty, Translucent)
 * - Mouse glare tracking on stone slab media
 * - Clean material inspection modal (100% material description, 0% temperature/heat ratings)
 * - Hero 3D interactive slab switcher
 */

(function () {
  "use strict";

  // Elements
  const section = document.getElementById("liquidFlowSection");
  if (!section) return;

  const rows = Array.from(section.querySelectorAll(".liquid-stone-row"));
  const modal = document.getElementById("liquidModal");
  const modalClose = document.getElementById("liquidModalClose");
  const modalImg = document.getElementById("liquidModalImg");
  const modalTitle = document.getElementById("liquidModalTitle");
  const modalGeology = document.getElementById("liquidModalGeology");
  const modalOrigin = document.getElementById("liquidModalOrigin");
  const modalDesc = document.getElementById("liquidModalDesc");
  const modalCategory = document.getElementById("liquidModalCategory");
  const modalThickness = document.getElementById("liquidModalThickness");
  const modalFinishes = document.getElementById("liquidModalFinishes");
  const modalAvailability = document.getElementById("liquidModalAvailability");
  const modalApps = document.getElementById("liquidModalApps");
  const modalCatalogLink = document.getElementById("liquidModalCatalogLink");

  // 1. SCROLL-TRIGGERED VERTICAL LIQUID POPUP (IntersectionObserver)
  if ("IntersectionObserver" in window) {
    const rowObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const row = entry.target;
            row.classList.add("liquid-flow-in");
            rowObserver.unobserve(row);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    rows.forEach(function (row) {
      rowObserver.observe(row);
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("liquid-flow-in");
    });
  }

  // 2. ULTRA-SMOOTH MOUSE-TRACKING SPECULAR GLARE (RAF throttled)
  rows.forEach(function (row) {
    const media = row.querySelector(".liquid-stone-media");
    if (!media) return;

    let ticking = false;
    let latestX = 50;
    let latestY = 50;

    media.addEventListener(
      "mousemove",
      function (e) {
        const rect = media.getBoundingClientRect();
        latestX = ((e.clientX - rect.left) / rect.width) * 100;
        latestY = ((e.clientY - rect.top) / rect.height) * 100;

        if (!ticking) {
          window.requestAnimationFrame(function () {
            media.style.setProperty("--mouse-x", `${latestX}%`);
            media.style.setProperty("--mouse-y", `${latestY}%`);
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  });

  // 3. CLEAN MATERIAL INSPECT MODAL (ZERO TEMPERATURE / THERMAL INFO)
  const stoneData = {
    quartzite: {
      title: "Exotic Quartzite",
      geology: "Metamorphic Quartz Sandstone",
      origin: "Brazil (Bahia & Espirito Santo)",
      desc: "Pure recrystallized sandstone formed under colossal tectonic pressure. Quartzite pairs the ethereal luminescence and flowing movement of marble with exceptional natural mineral density. Completely impervious to red wine, citrus acids, and cutlery scratches.",
      category: "Natural Metamorphic",
      thickness: "2 cm & 3 cm Bookmatched Slabs",
      finishes: "Polished Mirror, Leathered Satin, Honed Velvet",
      availability: "Consecutive Bundles In Stock",
      apps: "Waterfall Islands · Backlit Walls · High-End Countertops",
      img: "assets/images/stone-types/quartzite.jpg",
      catalogCategory: "quartzite",
    },
    marble: {
      title: "Fine Marble",
      geology: "Metamorphic Recrystallized Limestone",
      origin: "Italy (Carrara) & Greece",
      desc: "The enduring benchmark of classical and contemporary architectural prestige. Imported directly from the Apuan Alps of Tuscany, our natural marbles offer dramatic brecciated veining, subtle translucency, and consecutive sequence bundles for mirrored bookmatched layouts.",
      category: "Natural Metamorphic",
      thickness: "2 cm & 3 cm Calibrated Slabs",
      finishes: "Polished High Gloss, Honed Matte, Satin Silk",
      availability: "Full Inventory In Stock",
      apps: "Showcase Islands · Master En-Suites · Fireplace Surrounds",
      img: "assets/images/stone-types/marble.jpg",
      catalogCategory: "marble",
    },
    granite: {
      title: "Natural Granite",
      geology: "Igneous Intrusive Magma",
      origin: "Brazil, India & Norway",
      desc: "Pure volcanic fortitude formed by molten magma slowly crystallizing miles beneath the Earth's crust. Interlocking quartz, feldspar, and mica crystals produce unmatched structural strength, deep chromatic depth, and enduring resistance to heavy culinary preparation.",
      category: "Natural Igneous",
      thickness: "2 cm & 3 cm Heavy-Duty Slabs",
      finishes: "Polished, Leathered Tactile, Flamed, Honed",
      availability: "High Volume In Stock",
      apps: "Chef's Prep Kitchens · Outdoor BBQ Islands · Commercial Bars",
      img: "assets/images/stone-types/granite.jpg",
      catalogCategory: "granite",
    },
    quartz: {
      title: "Gran Trade Quartz",
      geology: "93% Pure Quartz Composite",
      origin: "USA & Global Surfacing",
      desc: "Advanced architectural engineering tailored for modern family living and demanding commercial projects. Crafted from 93% pure crushed natural quartz bonded with high-grade polymers. Zero porosity ensures liquids and oils never penetrate, requiring zero sealing over its lifespan.",
      category: "Engineered Surfacing",
      thickness: "Jumbo Slabs (63\" x 128\") · 2 cm & 3 cm",
      finishes: "High Polish Brilliant, Soft Touch Matte",
      availability: "Full Palette In Stock",
      apps: "Modern Family Kitchens · Multi-Unit Developments · Hospitality Suites",
      img: "assets/images/stone-types/quartz.jpg",
      catalogCategory: "quartz",
    },
    soapstone: {
      title: "Natural Soapstone",
      geology: "Metamorphic Steatite Talc Rock",
      origin: "Brazil & Virginia, USA",
      desc: "An authentic artisanal heritage stone prized for its silky-smooth tactile touch. Soapstone is naturally non-porous and chemically inert, making it immune to lemon juice, vinegar, and household acids. Develops an organic, rich charcoal patina when seasoned with food-safe mineral oil.",
      category: "Natural Metamorphic",
      thickness: "3 cm Architectural Slabs",
      finishes: "Honed Silky Matte",
      availability: "Quarried Bundles In Stock",
      apps: "Artisanal Kitchens · Fireplace Hearths · Chemistry Benches",
      img: "assets/images/stone-types/soapstone.jpg",
      catalogCategory: "soapstone",
    },
    semi: {
      title: "Semi-Precious Gemstone",
      geology: "Handcrafted Natural Agate & Crystal Geode",
      origin: "Brazil & Madagascar",
      desc: "The pinnacle of architectural opulence and lapidary craftsmanship. Skilled artisans hand-select and composite translucent slices of genuine natural agate, petrified wood, and crystal geode. Designed specifically for dramatic rear-illumination with LED light panels.",
      category: "Natural Gemstone Composite",
      thickness: "2 cm Reinforced Slabs",
      finishes: "Mirror Polished Gemstone Surface",
      availability: "Exotic Showcase Inventory",
      apps: "Backlit Luxury Bars · Powder Room Statement Walls · VIP Foyers",
      img: "assets/images/stone-types/semi-precious.jpg",
      catalogCategory: "semi",
    },
    monuments: {
      title: "Civic Monuments",
      geology: "Certified Structural Granite",
      origin: "North America & India",
      desc: "Certified structural-grade natural granites quarried for multi-generational outdoor permanence. Dense, uniform crystalline matrix withstands severe Northeastern freeze-thaw cycles and weathering without surface degradation. Provides flawless contrast for precision laser etching and diamond engraving.",
      category: "Structural Granite",
      thickness: "Custom Architectural Blanks, Bases & Dies",
      finishes: "Polished Face, Rock Pitch, Thermal Stipple",
      availability: "Industrial Skids In Yard",
      apps: "Civic Memorials · Public Plazas · Architectural Historic Markers",
      img: "assets/images/stone-types/monuments.jpg",
      catalogCategory: "monuments",
    },
    tile: {
      title: "Architectural Tile",
      geology: "Calibrated Travertine & Natural Marble",
      origin: "Italy & Turkey",
      desc: "Precision-calibrated natural stone tiles crafted to provide seamless spatial continuity across interior floors, bathrooms, and exterior living spaces. Available in interlocking French patterns, large-format rectangles, and modular squares with dependable natural foot traction.",
      category: "Natural Calibrated Formats",
      thickness: "French Pattern Sets · 12\"x24\" · 1/2\" Calibrated",
      finishes: "Tumbled, Brushed, Honed, Pillowed Edge",
      availability: "Crated Pallets In Stock",
      apps: "Master Shower Enclosures · Foyer Flooring · Covered Loggias",
      img: "assets/images/stone-types/tile.jpg",
      catalogCategory: "tile",
    },
  };

  function openLiquidModal(familyKey) {
    const data = stoneData[familyKey];
    if (!data || !modal) return;

    if (modalImg) modalImg.src = data.img;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalGeology) modalGeology.textContent = data.geology;
    if (modalOrigin) modalOrigin.textContent = data.origin;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalCategory) modalCategory.textContent = data.category;
    if (modalThickness) modalThickness.textContent = data.thickness;
    if (modalFinishes) modalFinishes.textContent = data.finishes;
    if (modalAvailability) modalAvailability.textContent = data.availability;
    if (modalApps) modalApps.textContent = data.apps;
    if (modalCatalogLink) modalCatalogLink.href = `collections.html?category=${data.catalogCategory}`;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLiquidModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  rows.forEach(function (row) {
    const family = row.getAttribute("data-family");
    const inspectBtn = row.querySelector(".liquid-quick-view-btn");
    const media = row.querySelector(".liquid-stone-media");

    if (inspectBtn) {
      inspectBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openLiquidModal(family);
      });
    }

    if (media) {
      media.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        openLiquidModal(family);
      });
    }
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeLiquidModal);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeLiquidModal();
    });
  }

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      closeLiquidModal();
    }
  });

  // 5. HERO 3D SLAB SWITCHER
  const heroCard = document.getElementById("heroSlabCard");
  const heroImg = document.getElementById("heroSlabImg");
  const heroTitle = document.getElementById("heroSlabTitle");
  const heroSub = document.getElementById("heroSlabSub");
  const heroBtns = Array.from(document.querySelectorAll(".hero-stone-btn"));

  const heroStones = {
    quartzite: {
      title: "Aquamarine Quartzite",
      sub: "Exotic Quartzite · Brazil · 2 cm / 3 cm",
      img: "assets/images/stone-types/quartzite.jpg",
    },
    marble: {
      title: "Arabescato Carrara",
      sub: "Fine Marble · Italy · 2 cm / 3 cm",
      img: "assets/images/stone-types/marble.jpg",
    },
    granite: {
      title: "Black Forest Granite",
      sub: "Natural Granite · Brazil · 2 cm / 3 cm",
      img: "assets/images/stone-types/granite.jpg",
    },
    quartz: {
      title: "Calacatta Alps Quartz",
      sub: "Gran Trade Quartz · Engineered · 2 cm / 3 cm",
      img: "assets/images/stone-types/quartz.jpg",
    },
  };

  heroBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      heroBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.getAttribute("data-stone");
      const stone = heroStones[key];
      if (stone && heroImg && heroTitle && heroSub) {
        heroImg.style.opacity = "0.4";
        setTimeout(function () {
          heroImg.src = stone.img;
          heroTitle.textContent = stone.title;
          heroSub.textContent = stone.sub;
          heroImg.style.opacity = "1";
        }, 150);
      }
    });
  });

  if (heroCard) {
    heroCard.addEventListener("mousemove", function (e) {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -5;
      const rotY = ((x - centerX) / centerX) * 5;

      heroCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    heroCard.addEventListener("mouseleave", function () {
      heroCard.style.transform = "";
    });
  }
})();
