/**
 * GRAN TRADE INC. — HOMEPAGE DYNAMIC CONTENT LOADER
 * Automatically applies content updates saved via the Open Source Web File Manager & Admin Portal.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "grantrade_homepage_content";

  async function loadHomepageContent() {
    let data = null;

    // 1. Check local storage for recent edits from Web File Manager
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        data = JSON.parse(local);
      }
    } catch (_) {}

    // 2. Fallback to data/homepage.json if no local overrides
    if (!data) {
      try {
        const res = await fetch("data/homepage.json");
        if (res.ok) {
          data = await res.json();
        }
      } catch (_) {}
    }

    if (!data) return;

    applyHomepageContent(data);
  }

  function applyHomepageContent(d) {
    // Hero Section
    if (d.hero) {
      const heroTag = document.querySelector(".hero-tag span");
      if (heroTag && d.hero.tag) heroTag.textContent = d.hero.tag;

      const heroH1 = document.querySelector(".hero-left h1");
      if (heroH1 && d.hero.title) heroH1.textContent = d.hero.title;

      const heroLead = document.querySelector(".hero-left p.lead");
      if (heroLead && d.hero.lead) heroLead.textContent = d.hero.lead;

      const heroBg = document.querySelector("img.hero-bg");
      if (heroBg && d.hero.bgImage) heroBg.src = d.hero.bgImage;

      const metricItems = document.querySelectorAll(".hero-metrics .metric-item");
      if (metricItems[0] && d.hero.metric1Val) {
        const val = metricItems[0].querySelector(".metric-val");
        const lbl = metricItems[0].querySelector(".metric-lbl");
        if (val) val.textContent = d.hero.metric1Val;
        if (lbl) lbl.textContent = d.hero.metric1Lbl;
      }
      if (metricItems[1] && d.hero.metric2Val) {
        const val = metricItems[1].querySelector(".metric-val");
        const lbl = metricItems[1].querySelector(".metric-lbl");
        if (val) val.textContent = d.hero.metric2Val;
        if (lbl) lbl.textContent = d.hero.metric2Lbl;
      }
    }

    // Featured Hero Slab
    if (d.featuredSlab) {
      const slabTitle = document.getElementById("heroSlabTitle");
      if (slabTitle && d.featuredSlab.title) slabTitle.textContent = d.featuredSlab.title;

      const slabSub = document.getElementById("heroSlabSub");
      if (slabSub && d.featuredSlab.sub) slabSub.textContent = d.featuredSlab.sub;

      const slabImg = document.getElementById("heroSlabImg");
      if (slabImg && d.featuredSlab.image) slabImg.src = d.featuredSlab.image;
    }

    // Material Taxonomy Header
    if (d.taxonomyHead) {
      const eye = document.querySelector(".liquid-head-wrap .eyebrow");
      if (eye && d.taxonomyHead.eyebrow) eye.textContent = d.taxonomyHead.eyebrow;

      const h2 = document.querySelector(".liquid-head-wrap h2");
      if (h2 && d.taxonomyHead.title) h2.textContent = d.taxonomyHead.title;

      const lead = document.querySelector(".liquid-head-wrap p.lead");
      if (lead && d.taxonomyHead.lead) lead.textContent = d.taxonomyHead.lead;
    }

    // Why Gran Trade (4 Cards)
    if (d.whyGranTrade && d.whyGranTrade.cards) {
      const whyCards = document.querySelectorAll(".why-grid .why-card");
      d.whyGranTrade.cards.forEach((card, idx) => {
        if (whyCards[idx]) {
          const h3 = whyCards[idx].querySelector("h3");
          const p = whyCards[idx].querySelector("p");
          if (h3 && card.title) h3.textContent = card.title;
          if (p && card.desc) p.textContent = card.desc;
        }
      });
    }

    // Applied / Fabrication Vignette
    if (d.applied) {
      const appH2 = document.querySelector(".applied-text h2");
      if (appH2 && d.applied.title) appH2.textContent = d.applied.title;

      const appLead = document.querySelector(".applied-text p.lead");
      if (appLead && d.applied.lead) appLead.textContent = d.applied.lead;

      const appImg = document.querySelector(".applied-media img");
      if (appImg && d.applied.image) appImg.src = d.applied.image;

      const appItems = document.querySelectorAll(".applied-features .applied-item");
      if (appItems[0] && d.applied.fabricatorsDesc) {
        const p = appItems[0].querySelector("p");
        if (p) p.textContent = d.applied.fabricatorsDesc;
      }
      if (appItems[1] && d.applied.designersDesc) {
        const p = appItems[1].querySelector("p");
        if (p) p.textContent = d.applied.designersDesc;
      }
      if (appItems[2] && d.applied.homeownersDesc) {
        const p = appItems[2].querySelector("p");
        if (p) p.textContent = d.applied.homeownersDesc;
      }
    }

    // Yard Visit Callout
    if (d.yardCta) {
      const ctaH2 = document.querySelector("section.section h2[style*='font-size:2.2rem']") || document.querySelector("section:has(a[href*='tel:']) h2");
      if (ctaH2 && d.yardCta.title) ctaH2.textContent = d.yardCta.title;
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHomepageContent);
  } else {
    loadHomepageContent();
  }

  // Export helper for preview
  window.GranTradeHomepageLoader = {
    reload: loadHomepageContent,
    apply: applyHomepageContent
  };
})();
