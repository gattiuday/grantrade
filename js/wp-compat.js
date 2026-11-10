/**
 * GRAN TRADE INC. — WORDPRESS & STATIC ENVIRONMENT ADAPTER
 * Resolves asset paths, page routes, and custom WP slab entries seamlessly
 * across both static HTML hosting and WordPress themes.
 */
(function (global) {
  "use strict";

  const env = global.GRAN_TRADE_ENV || {};
  const isWordPress = Boolean(env.isWordPress);
  const themeUrl = (env.themeUrl || "").replace(/\/+$/, "");
  const homeUrl = (env.homeUrl || "").replace(/\/+$/, "");
  const pageMap = env.pages || {};

  function isAbsoluteOrData(url) {
    return /^(https?:)?\/\/|^data:|^blob:|^mailto:|^tel:|^#/i.test(url);
  }

  function resolveAsset(path) {
    if (!path || typeof path !== "string") return path || "";
    const trimmed = path.trim();
    if (!trimmed || isAbsoluteOrData(trimmed)) return trimmed;
    if (!isWordPress || !themeUrl) return trimmed;
    if (trimmed.indexOf(themeUrl) === 0) return trimmed;
    const clean = trimmed.replace(/^\.?\//, "");
    return themeUrl + "/" + clean;
  }

  function resolvePage(href) {
    if (!href || typeof href !== "string") return href || "";
    const trimmed = href.trim();
    if (!trimmed || isAbsoluteOrData(trimmed)) return trimmed;
    if (!isWordPress) return trimmed;

    const hashIdx = trimmed.indexOf("#");
    const hashPart = hashIdx >= 0 ? trimmed.slice(hashIdx) : "";
    const withoutHash = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;

    const queryIdx = withoutHash.indexOf("?");
    const queryPart = queryIdx >= 0 ? withoutHash.slice(queryIdx) : "";
    const filePart = (queryIdx >= 0 ? withoutHash.slice(0, queryIdx) : withoutHash)
      .replace(/^\.?\//, "")
      .toLowerCase();

    const keyMap = {
      "": "home",
      "index.html": "home",
      "about.html": "about",
      "collections.html": "collections",
      "showroom.html": "showroom",
      "contact.html": "contact",
      "slab.html": "slab",
    };

    const routeKey = keyMap[filePart];
    if (routeKey && pageMap[routeKey]) {
      return pageMap[routeKey] + queryPart + hashPart;
    }
    if (routeKey === "home" && homeUrl) {
      return homeUrl + "/" + queryPart + hashPart;
    }
    return trimmed;
  }

  // Merge or replace WordPress CPT stones in GRAN_TRADE_CATALOG
  function mergeWordPressStones() {
    if (!isWordPress) return;
    const wpList = Array.isArray(env.wpStones) ? env.wpStones : [];
    const replaceBuiltin = Boolean(env.replaceBuiltinCatalog);
    if (!global.GRAN_TRADE_CATALOG || !Array.isArray(global.GRAN_TRADE_CATALOG.all)) return;

    if (typeof global.GRAN_TRADE_CATALOG.setExternalStones === "function") {
      global.GRAN_TRADE_CATALOG.setExternalStones(wpList, replaceBuiltin);
      return;
    }

    const existing = global.GRAN_TRADE_CATALOG.all;
    const byId = new Map();
    if (replaceBuiltin) {
      existing.length = 0;
      if (global.GRAN_TRADE_CATALOG.byId) {
        Object.keys(global.GRAN_TRADE_CATALOG.byId).forEach(function (k) {
          delete global.GRAN_TRADE_CATALOG.byId[k];
        });
      }
    } else {
      existing.forEach(function (item) {
        if (item && item.id) byId.set(item.id, item);
      });
    }

    wpList.forEach(function (wpStone) {
      if (!wpStone || !wpStone.id) return;
      if (byId.has(wpStone.id)) {
        Object.assign(byId.get(wpStone.id), wpStone);
      } else {
        existing.unshift(wpStone);
        byId.set(wpStone.id, wpStone);
      }
      if (global.GRAN_TRADE_CATALOG.byId) {
        global.GRAN_TRADE_CATALOG.byId[wpStone.id] = byId.get(wpStone.id);
      }
    });

    if (typeof global.GRAN_TRADE_CATALOG.applyLocalOverrides === "function") {
      global.GRAN_TRADE_CATALOG.applyLocalOverrides();
    }
  }

  mergeWordPressStones();

  global.GranTradeWP = {
    isWordPress: isWordPress,
    env: env,
    asset: resolveAsset,
    page: resolvePage,
    mergeWordPressStones: mergeWordPressStones,
  };
})(window);

