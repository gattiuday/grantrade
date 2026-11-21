/**
 * GRAN TRADE INC. — STONE CATALOG DATA MODULE
 * Complete wholesale inventory dataset with GT Numbers, Lot Numbers, Thicknesses, Sizes, and 2-Picture Views.
 */
(function (global) {
  "use strict";

  const STONES = [];

  const OVERRIDES_KEY = "granTrade_stone_overrides_v1";
  const BUILTIN_COLOR_LABELS = {
    blue: "Blue / Teal",
    green: "Green",
    white: "White",
    grey: "Grey",
    black: "Black",
    gold: "Gold / Amber",
    cream: "Cream / Beige",
    brown: "Brown",
    red: "Red",
  };
  const COLOR_HEX_MAP = {
    white: "#f3f4f6",
    cream: "#ede0cc",
    beige: "#e6d7be",
    ivory: "#f5f1e6",
    grey: "#8b929a",
    gray: "#8b929a",
    silver: "#b8bec6",
    charcoal: "#3f444c",
    black: "#1f2328",
    blue: "#2f6b8a",
    navy: "#1e3a5f",
    teal: "#1b7a78",
    aquamarine: "#2e8b89",
    seafoam: "#5ea396",
    green: "#2f6e49",
    emerald: "#197a52",
    olive: "#5f6b3a",
    sage: "#7d937e",
    gold: "#c7963e",
    amber: "#b87424",
    bronze: "#8c6239",
    brown: "#7c5238",
    taupe: "#8d7b6b",
    red: "#9e3333",
    burgundy: "#6b232e",
  };

  function normalizeColorTags(input) {
    const rawList = Array.isArray(input)
      ? input
      : String(input || "").split(/[,;|]+/);
    const seen = new Set();
    const out = [];
    rawList.forEach((item) => {
      const clean = String(item || "").trim().toLowerCase().replace(/\s+/g, " ");
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        out.push(clean);
      }
    });
    return out;
  }

  function formatColorLabel(tag) {
    const clean = String(tag || "").trim().toLowerCase();
    if (!clean) return "";
    if (BUILTIN_COLOR_LABELS[clean]) return BUILTIN_COLOR_LABELS[clean];
    return clean.replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  function getColorSwatch(tag) {
    const clean = String(tag || "").trim().toLowerCase();
    const wpCustom = global.GRAN_TRADE_ENV && global.GRAN_TRADE_ENV.customColors;
    if (wpCustom && wpCustom[clean] && wpCustom[clean].hex) return wpCustom[clean].hex;
    if (COLOR_HEX_MAP[clean]) return COLOR_HEX_MAP[clean];
    const words = clean.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      if (wpCustom && wpCustom[words[i]] && wpCustom[words[i]].hex) return wpCustom[words[i]].hex;
      if (COLOR_HEX_MAP[words[i]]) return COLOR_HEX_MAP[words[i]];
    }
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (clean.charCodeAt(i) + ((hash << 5) - hash)) | 0;
    }
    return `hsl(${Math.abs(hash) % 360}, 36%, 46%)`;
  }

  function readOverrides() {
    try {
      const raw = global.localStorage && global.localStorage.getItem(OVERRIDES_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function writeOverrides(map) {
    try {
      if (global.localStorage) {
        global.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
      }
    } catch (_) {}
  }

  const NO_GT_CATEGORIES = new Set(["granite", "quartzite", "marble"]);
  const CATEGORY_LABELS = {
    quartzite: "Quartzite",
    quartz: "Quartz",
    granite: "Granite",
    marble: "Marble",
    monuments: "Monuments",
    soapstone: "Soapstone",
    semi: "Semi Precious",
    tile: "Tiles",
  };

  function getCategoryLabel(cat, fallback) {
    const key = String(cat || "").toLowerCase().trim();
    if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
    return fallback || cat || "";
  }

  function normalizeThickness(raw) {
    if (raw === null || raw === undefined) return "";
    const str = String(raw).trim();
    if (!str) return "";
    const cleaned = (/calibrated/i.test(str)
      ? str.replace(/\b2\s*cm\s*·\s*3\s*cm/gi, "3 cm").replace(/\bcalibrated\b/gi, "")
      : str
    )
      .replace(/\s{2,}/g, " ")
      .replace(/\s*·\s*$/g, "")
      .trim();
    return cleaned;
  }

  function cloneStone(s) {
    return Object.assign({}, s, {
      colors: Array.isArray(s.colors) ? s.colors.slice() : normalizeColorTags(s.colors),
      tags: Array.isArray(s.tags) ? s.tags.slice() : (s.tags || []),
    });
  }

  function hasGtNumber(stoneOrCategory) {
    if (!stoneOrCategory) return false;
    if (typeof stoneOrCategory === "string") {
      return !NO_GT_CATEGORIES.has(stoneOrCategory.toLowerCase().trim());
    }
    const cat = String(stoneOrCategory.category || "").toLowerCase().trim();
    if (NO_GT_CATEGORIES.has(cat)) return false;
    return Boolean(stoneOrCategory.gtNumber && String(stoneOrCategory.gtNumber).trim());
  }

  function normalizeStone(stone) {
    if (!stone || typeof stone !== "object") return stone;
    const cat = String(stone.category || "").toLowerCase().trim();
    if (NO_GT_CATEGORIES.has(cat)) {
      stone.gtNumber = "";
    }
    if (CATEGORY_LABELS[cat]) {
      stone.categoryLabel = CATEGORY_LABELS[cat];
    }
    if (stone.thickness !== undefined) {
      stone.thickness = normalizeThickness(stone.thickness);
    }
    stone.colors = normalizeColorTags(stone.colors);
    return stone;
  }

  // Pristine base snapshot & WordPress / GitHub Pages empty-until-uploaded store
  const INITIAL_STONES = STONES.map((s) => normalizeStone(cloneStone(s)));
  let externalStones = [];
  let externalReplaceBuiltin = true;

  // Helper dictionary keyed by ID (mutated in-place on refresh so references stay valid)
  const STONES_BY_ID = {};

  function applyLocalOverrides() {
    const baseList = externalReplaceBuiltin ? [] : INITIAL_STONES.map(cloneStone);
    const byId = new Map();
    baseList.forEach((item) => {
      if (item && item.id) byId.set(item.id, item);
    });

    externalStones.forEach((extStone) => {
      if (!extStone || !extStone.id) return;
      if (byId.has(extStone.id)) {
        Object.assign(byId.get(extStone.id), cloneStone(extStone));
      } else {
        const copy = cloneStone(extStone);
        baseList.unshift(copy);
        byId.set(copy.id, copy);
      }
    });

    const overrides = readOverrides();
    const deletedIds = new Set();

    Object.keys(overrides).forEach((id) => {
      const patch = overrides[id];
      if (!patch || typeof patch !== "object") return;
      if (patch._deleted) {
        deletedIds.add(id);
        return;
      }
      if (byId.has(id)) {
        const target = byId.get(id);
        Object.assign(target, patch);
        normalizeStone(target);
      } else if (!(global.GRAN_TRADE_ENV && global.GRAN_TRADE_ENV.replaceBuiltinCatalog) && patch.name) {
        const created = normalizeStone(Object.assign({ id }, cloneStone(patch)));
        baseList.unshift(created);
        byId.set(id, created);
      }
    });

    const finalList = baseList
      .filter((s) => s && s.id && !deletedIds.has(s.id))
      .map((s) => normalizeStone(s));

    STONES.length = 0;
    Object.keys(STONES_BY_ID).forEach((k) => {
      delete STONES_BY_ID[k];
    });
    finalList.forEach((s) => {
      STONES.push(s);
      STONES_BY_ID[s.id] = s;
    });

    return STONES;
  }

  applyLocalOverrides();

  global.GRAN_TRADE_CATALOG = {
    all: STONES,
    byId: STONES_BY_ID,
    categoryLabels: Object.assign({}, CATEGORY_LABELS),
    noGtCategories: Array.from(NO_GT_CATEGORIES),
    getCategoryLabel,
    hasGtNumber,
    normalizeColorTags,
    formatColorLabel,
    getColorSwatch,
    applyLocalOverrides,
    refresh: function () {
      return applyLocalOverrides();
    },
    setExternalStones: function (list, replaceBuiltin) {
      externalStones = Array.isArray(list) ? list.map(cloneStone) : [];
      externalReplaceBuiltin = Boolean(replaceBuiltin);
      return applyLocalOverrides();
    },
    saveOverride: function (id, patch) {
      if (!id || !patch || typeof patch !== "object") return null;
      const overrides = readOverrides();
      const prev = overrides[id] ? Object.assign({}, overrides[id]) : {};
      delete prev._deleted;
      const nextPatch = Object.assign(prev, patch);
      if ("colors" in patch) {
        nextPatch.colors = normalizeColorTags(patch.colors);
      }
      if (nextPatch.category && CATEGORY_LABELS[nextPatch.category]) {
        nextPatch.categoryLabel = CATEGORY_LABELS[nextPatch.category];
      }
      overrides[id] = nextPatch;
      writeOverrides(overrides);
      applyLocalOverrides();
      return STONES_BY_ID[id] || null;
    },
    deleteOverride: function (id) {
      if (!id) return false;
      const overrides = readOverrides();
      const isCustomOnly = !INITIAL_STONES.some((s) => s.id === id) && !externalStones.some((s) => s.id === id);
      if (isCustomOnly) {
        delete overrides[id];
      } else {
        overrides[id] = { _deleted: true };
      }
      writeOverrides(overrides);
      applyLocalOverrides();
      return true;
    },
    clearOverrides: function () {
      try {
        if (global.localStorage) global.localStorage.removeItem(OVERRIDES_KEY);
      } catch (_) {}
      return applyLocalOverrides();
    },
    saveColorTags: function (id, tags) {
      const normalized = normalizeColorTags(tags);
      this.saveOverride(id, { colors: normalized });
      return normalized;
    },
    getAllColorTags: function () {
      const seen = new Set(Object.keys(BUILTIN_COLOR_LABELS));
      const extras = [];
      STONES.forEach((s) => {
        normalizeColorTags(s.colors).forEach((c) => {
          if (!seen.has(c)) {
            seen.add(c);
            extras.push(c);
          }
        });
      });
      extras.sort((a, b) => a.localeCompare(b));
      return Object.keys(BUILTIN_COLOR_LABELS).concat(extras);
    },
    getById: function (id) {
      if (!id) return STONES[0];
      const clean = String(id).toLowerCase().trim();
      return STONES_BY_ID[clean] || STONES.find((s) => s.name.toLowerCase() === clean) || STONES[0];
    }
  };
})(typeof window !== "undefined" ? window : this);
