/**
 * GRAN TRADE INC. — SLAB DETAIL VIEWER & SPEC ENGINE
 * Shared across static slab.html and WordPress page-slab.php / single-gt_slab.php
 */
(function () {
  "use strict";

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

  const catalog = window.GRAN_TRADE_CATALOG;
  if (!catalog) return;
  if (typeof catalog.applyLocalOverrides === "function") {
    catalog.applyLocalOverrides();
  }

  // 1. Get stone ID from URL query param (?id=...) or server-provided WordPress slug
  const params = new URLSearchParams(window.location.search);
  const stoneId = params.get("id") || window.GRAN_TRADE_CURRENT_SLAB_ID || "aquamarine-quartzite";

  const stone = catalog.getById(stoneId) || (catalog.all && catalog.all[0]);
  if (!stone) return;

  const rawThickness = String(stone.thickness || "").trim();
  const cleanThickness = rawThickness
    ? (rawThickness
      .replace(/\b2\s*cm\s*·\s*3\s*cm/gi, "3 cm")
      .replace(/\bcalibrated\b/gi, "")
      .trim() || "—")
    : "—";

  const showGt = Boolean(
    stone.gtNumber &&
    (typeof catalog.hasGtNumber === "function"
      ? catalog.hasGtNumber(stone)
      : !["granite", "quartzite", "marble"].includes(String(stone.category || "").toLowerCase()))
  );

  // 2. Populate Page Meta & Breadcrumbs
  document.title = showGt ? `${stone.name} (${stone.gtNumber}) — Gran Trade Inc.` : `${stone.name} — Gran Trade Inc.`;
  const metaDesc = document.getElementById("pageMetaDesc");
  if (metaDesc) {
    const gtPart = showGt ? `${stone.gtNumber}, ` : "";
    const lotMeta = stone.lotNumber ? `${stone.lotNumber}` : "";
    const specParts = [cleanThickness !== "—" ? `Thickness ${cleanThickness}` : "", stone.size ? `dimensions ${stone.size}` : ""].filter(Boolean).join(", ");
    metaDesc.content = `Inspect ${stone.name} (${gtPart}${lotMeta}) at Gran Trade Carlstadt warehouse.${specParts ? ` ${specParts}.` : ""}`;
  }

  const crumbCat = document.getElementById("crumbCategory");
  if (crumbCat) {
    crumbCat.textContent = stone.categoryLabel;
    crumbCat.href = wpPage(`collections.html?category=${stone.category}`);
  }
  const crumbName = document.getElementById("crumbStoneName");
  if (crumbName) {
    crumbName.textContent = showGt ? `${stone.name} (${stone.gtNumber})` : stone.name;
  }

  // 3. Populate Slab Header & Required Details (GT# when applicable, Lot#, Thickness, Size)
  const catBadge = document.getElementById("slabCatBadge");
  if (catBadge) catBadge.textContent = stone.categoryLabel;
  const slabName = document.getElementById("slabName");
  if (slabName) slabName.textContent = stone.name;
  const specGt = document.getElementById("specGtNumber");
  if (specGt) {
    const gtBlock = specGt.closest(".spec-block");
    if (showGt) {
      specGt.textContent = stone.gtNumber;
      if (gtBlock) gtBlock.style.display = "";
    } else {
      specGt.textContent = "";
      if (gtBlock) gtBlock.style.display = "none";
    }
  }
  const specLot = document.getElementById("specLotNumber");
  if (specLot) {
    const lotClean = String(stone.lotNumber || "").replace(/^LOT\s*#?/i, "").trim();
    specLot.textContent = lotClean ? `#${lotClean}` : "—";
  }
  const specThick = document.getElementById("specThickness");
  if (specThick) specThick.textContent = cleanThickness;
  const specSize = document.getElementById("specSize");
  if (specSize) {
    const sizeClean = String(stone.size || "").replace(/\s*·\s*Full Slab/i, "").trim();
    specSize.textContent = sizeClean || "—";
  }

  // Secondary specs
  const specFinish = document.getElementById("specFinish");
  if (specFinish) specFinish.textContent = stone.finish || "—";
  const specType = document.getElementById("specType");
  if (specType) specType.textContent = stone.typeLabel || (stone.type === "engineered" ? "Engineered Quartz" : "Natural Metamorphic Stone");
  const slabDesc = document.getElementById("slabDesc");
  if (slabDesc) slabDesc.textContent = stone.description;

  // Configure Trade Inquiry Link with pre-filled Stone & Lot (plus GT# if applicable)
  const holdBtn = document.getElementById("holdBtn");
  if (holdBtn) {
    const gtParam = showGt ? `gt=${encodeURIComponent(stone.gtNumber)}&` : "";
    holdBtn.href = wpPage(`contact.html?${gtParam}slab=${encodeURIComponent(stone.name)}&lot=${encodeURIComponent(stone.lotNumber)}`);
  }

  // 4. Configure the 2 Pictures in Post
  const fallbackUrl = wpAsset(`assets/images/stone-types/${stone.category}.jpg`);
  const pic1Url = wpAsset(stone.image1 || fallbackUrl);
  const pic2Url = wpAsset(stone.image2 || pic1Url);

  const mainStageImg = document.getElementById("mainStageImg");
  const stageTag = document.getElementById("stageTag");
  const stageSingle = document.getElementById("mainStageSingle");
  const thumb1 = document.getElementById("thumb1");
  const thumb2 = document.getElementById("thumb2");
  const thumbImg1 = document.getElementById("thumbImg1");
  const thumbImg2 = document.getElementById("thumbImg2");
  const stagePrevBtn = document.getElementById("stagePrevBtn");
  const stageNextBtn = document.getElementById("stageNextBtn");

  // Zoom & Full Screen Controls
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomResetBtn = document.getElementById("zoomResetBtn");
  const zoomLevelText = document.getElementById("zoomLevelText");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const fsIconExpand = document.getElementById("fsIconExpand");
  const fsIconCompress = document.getElementById("fsIconCompress");
  const fsText = document.getElementById("fsText");

  if (thumbImg1) thumbImg1.src = pic1Url;
  if (thumbImg2) thumbImg2.src = pic2Url;

  [mainStageImg, thumbImg1, thumbImg2].forEach((img) => {
    if (!img) return;
    img.onerror = function () {
      this.onerror = null;
      this.src = fallbackUrl;
    };
  });

  // ================= 1. PRECISION INTERACTIVE ZOOM & PAN ENGINE =================
  let zoomLevel = 1.0;
  const minZoom = 1.0;
  const maxZoom = 4.0;
  const zoomStep = 0.35;
  let panX = 0;
  let panY = 0;

  let isDragging = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let startPanX = 0;
  let startPanY = 0;

  let isPinching = false;
  let initialPinchDistance = 0;
  let initialPinchZoom = 1.0;
  let pinchFocalX = 0;
  let pinchFocalY = 0;
  let lastTapTime = 0;

  function getPanBounds(zoom) {
    if (!stageSingle || zoom <= 1.001) return { maxX: 0, maxY: 0 };
    const rect = stageSingle.getBoundingClientRect();
    const maxX = Math.max(0, (rect.width * (zoom - 1)) / 2);
    const maxY = Math.max(0, (rect.height * (zoom - 1)) / 2);
    return { maxX, maxY };
  }

  function clampPan(x, y, zoom) {
    const bounds = getPanBounds(zoom);
    return {
      x: Math.max(-bounds.maxX, Math.min(bounds.maxX, x)),
      y: Math.max(-bounds.maxY, Math.min(bounds.maxY, y)),
    };
  }

  function updateZoomTransform(animate = true) {
    if (zoomLevel <= 1.001) {
      zoomLevel = 1.0;
      panX = 0;
      panY = 0;
    } else {
      const clamped = clampPan(panX, panY, zoomLevel);
      panX = clamped.x;
      panY = clamped.y;
    }

    if (mainStageImg) {
      mainStageImg.style.transition = animate ? "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)" : "none";
      mainStageImg.style.transform = `translate3d(${panX.toFixed(2)}px, ${panY.toFixed(2)}px, 0) scale(${zoomLevel.toFixed(3)})`;
    }

    if (stageSingle) {
      stageSingle.classList.toggle("is-zoomed", zoomLevel > 1.01);
      if (zoomLevel <= 1.01) stageSingle.classList.remove("grabbing");
    }

    if (zoomLevelText) zoomLevelText.textContent = `${Math.round(zoomLevel * 100)}%`;
    if (zoomOutBtn) zoomOutBtn.disabled = zoomLevel <= minZoom + 0.01;
    if (zoomInBtn) zoomInBtn.disabled = zoomLevel >= maxZoom - 0.01;
  }

  function setZoomAt(newZoom, focalClientX, focalClientY, animate = true) {
    const targetZoom = Math.max(minZoom, Math.min(maxZoom, Math.round(newZoom * 100) / 100));
    if (Math.abs(targetZoom - zoomLevel) < 0.001 && targetZoom === 1) return;

    if (focalClientX !== undefined && focalClientY !== undefined && stageSingle) {
      const rect = stageSingle.getBoundingClientRect();
      const focalX = focalClientX - (rect.left + rect.width / 2);
      const focalY = focalClientY - (rect.top + rect.height / 2);
      const scaleRatio = targetZoom / zoomLevel;
      panX = panX - (focalX - panX) * (scaleRatio - 1);
      panY = panY - (focalY - panY) * (scaleRatio - 1);
    } else {
      const scaleRatio = targetZoom / (zoomLevel || 1);
      panX = panX * scaleRatio;
      panY = panY * scaleRatio;
    }

    zoomLevel = targetZoom;
    updateZoomTransform(animate);
  }

  function zoomIn() {
    setZoomAt(zoomLevel + zoomStep, undefined, undefined, true);
  }

  function zoomOut() {
    setZoomAt(zoomLevel - zoomStep, undefined, undefined, true);
  }

  function resetZoom() {
    zoomLevel = 1.0;
    panX = 0;
    panY = 0;
    updateZoomTransform(true);
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      zoomIn();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      zoomOut();
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetZoom();
    });
  }

  if (stageSingle) {
    stageSingle.addEventListener("mousedown", (e) => {
      if (e.target.closest(".stage-controls-overlay") || e.target.closest(".stage-nav-arrow")) return;
      if (zoomLevel <= 1.01) return;

      isDragging = true;
      startMouseX = e.clientX;
      startMouseY = e.clientY;
      startPanX = panX;
      startPanY = panY;
      stageSingle.classList.add("grabbing");
      if (mainStageImg) mainStageImg.style.transition = "none";
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startMouseX;
      const dy = e.clientY - startMouseY;
      const clamped = clampPan(startPanX + dx, startPanY + dy, zoomLevel);
      panX = clamped.x;
      panY = clamped.y;
      if (mainStageImg) {
        mainStageImg.style.transform = `translate3d(${panX.toFixed(2)}px, ${panY.toFixed(2)}px, 0) scale(${zoomLevel.toFixed(3)})`;
      }
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        if (stageSingle) stageSingle.classList.remove("grabbing");
        if (mainStageImg) mainStageImg.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
      }
    });

    stageSingle.addEventListener("wheel", (e) => {
      if (e.target.closest(".stage-controls-overlay") || e.target.closest(".stage-nav-arrow")) return;
      e.preventDefault();
      const delta = e.deltaY;
      const zoomDelta = -Math.sign(delta) * (Math.abs(delta) > 50 ? 0.3 : 0.18);
      setZoomAt(zoomLevel + zoomDelta, e.clientX, e.clientY, true);
    }, { passive: false });

    stageSingle.addEventListener("dblclick", (e) => {
      if (e.target.closest(".stage-controls-overlay") || e.target.closest(".stage-nav-arrow")) return;
      e.preventDefault();
      if (zoomLevel > 1.01) resetZoom();
      else setZoomAt(2.4, e.clientX, e.clientY, true);
    });

    stageSingle.addEventListener("touchstart", (e) => {
      if (e.target.closest(".stage-controls-overlay") || e.target.closest(".stage-nav-arrow")) return;

      if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTapTime < 320) {
          e.preventDefault();
          if (zoomLevel > 1.01) resetZoom();
          else setZoomAt(2.4, e.touches[0].clientX, e.touches[0].clientY, true);
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;

        if (zoomLevel > 1.01) {
          isDragging = true;
          startMouseX = e.touches[0].clientX;
          startMouseY = e.touches[0].clientY;
          startPanX = panX;
          startPanY = panY;
          stageSingle.classList.add("grabbing");
          if (mainStageImg) mainStageImg.style.transition = "none";
        }
      } else if (e.touches.length === 2) {
        isDragging = false;
        isPinching = true;
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchZoom = zoomLevel;
        pinchFocalX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        pinchFocalY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        if (mainStageImg) mainStageImg.style.transition = "none";
        e.preventDefault();
      }
    }, { passive: false });

    stageSingle.addEventListener("touchmove", (e) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (initialPinchDistance > 0) {
          const pinchRatio = currentDist / initialPinchDistance;
          const newZoom = Math.max(minZoom, Math.min(maxZoom, initialPinchZoom * pinchRatio));
          setZoomAt(newZoom, pinchFocalX, pinchFocalY, false);
        }
      } else if (isDragging && e.touches.length === 1 && zoomLevel > 1.01) {
        e.preventDefault();
        const dx = e.touches[0].clientX - startMouseX;
        const dy = e.touches[0].clientY - startMouseY;
        const clamped = clampPan(startPanX + dx, startPanY + dy, zoomLevel);
        panX = clamped.x;
        panY = clamped.y;
        if (mainStageImg) {
          mainStageImg.style.transform = `translate3d(${panX.toFixed(2)}px, ${panY.toFixed(2)}px, 0) scale(${zoomLevel.toFixed(3)})`;
        }
      }
    }, { passive: false });

    stageSingle.addEventListener("touchend", (e) => {
      if (isPinching && e.touches.length < 2) {
        isPinching = false;
        updateZoomTransform(true);
      }
      if (isDragging && e.touches.length === 0) {
        isDragging = false;
        if (stageSingle) stageSingle.classList.remove("grabbing");
        updateZoomTransform(true);
      }
    });

    stageSingle.addEventListener("touchcancel", () => {
      isPinching = false;
      isDragging = false;
      if (stageSingle) stageSingle.classList.remove("grabbing");
      updateZoomTransform(true);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoomIn();
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      zoomOut();
    } else if (e.key === "0" || e.key === "r" || e.key === "R") {
      e.preventDefault();
      resetZoom();
    } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && zoomLevel > 1.01) {
      e.preventDefault();
      const step = 50;
      if (e.key === "ArrowUp") panY += step;
      if (e.key === "ArrowDown") panY -= step;
      if (e.key === "ArrowLeft") panX += step;
      if (e.key === "ArrowRight") panX -= step;
      updateZoomTransform(true);
    }
  });

  window.addEventListener("resize", () => {
    if (zoomLevel > 1.01) updateZoomTransform(false);
  });

  // ================= 2. FULLSCREEN SYSTEM =================
  function isFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      (stageSingle && stageSingle.classList.contains("is-fallback-fullscreen"))
    );
  }

  function updateFullscreenUI() {
    const isFS = isFullscreen();
    if (fsIconExpand) fsIconExpand.style.display = isFS ? "none" : "block";
    if (fsIconCompress) fsIconCompress.style.display = isFS ? "block" : "none";
    if (fsText) fsText.textContent = isFS ? "Exit" : "Full Screen";
    if (stageSingle) stageSingle.setAttribute("aria-fullscreen", isFS ? "true" : "false");
    setTimeout(() => {
      if (zoomLevel > 1.01) updateZoomTransform(false);
    }, 60);
  }

  function enterFullscreen() {
    if (!stageSingle) return;
    stageSingle.classList.add("is-fallback-fullscreen");
    document.body.style.overflow = "hidden";
    updateFullscreenUI();

    try {
      const req = stageSingle.requestFullscreen || stageSingle.webkitRequestFullscreen || stageSingle.webkitRequestFullScreen;
      if (req) {
        const p = req.call(stageSingle);
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    } catch (err) {}
  }

  function exitFullscreen() {
    if (stageSingle) stageSingle.classList.remove("is-fallback-fullscreen");
    document.body.style.overflow = "";
    updateFullscreenUI();

    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.webkitCancelFullScreen;
        if (exit) exit.call(document);
      }
    } catch (err) {}
  }

  function toggleFullscreen() {
    if (isFullscreen()) exitFullscreen();
    else enterFullscreen();
  }

  window.slabViewer = {
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomAt,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    getZoomLevel: () => zoomLevel,
    isFullscreen,
  };

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  document.addEventListener("fullscreenchange", updateFullscreenUI);
  document.addEventListener("webkitfullscreenchange", updateFullscreenUI);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && stageSingle && stageSingle.classList.contains("is-fallback-fullscreen")) {
      exitFullscreen();
    }
  });

  // ================= 3. PICTURE SWITCHING =================
  let activePicture = 1;

  function setPicture(picNum) {
    activePicture = picNum;
    resetZoom();

    if (picNum === 1) {
      if (mainStageImg) {
        mainStageImg.src = pic1Url;
        mainStageImg.alt = `${stone.name} — Picture 1 (Full Slab Upright View)`;
      }
      if (stageTag) stageTag.textContent = "Picture 1 · Full Slab Upright View";
      if (thumb1) thumb1.classList.add("active");
      if (thumb2) thumb2.classList.remove("active");
    } else {
      if (mainStageImg) {
        mainStageImg.src = pic2Url;
        mainStageImg.alt = `${stone.name} — Picture 2 (Close-up Vein & Mineral Detail View)`;
      }
      if (stageTag) stageTag.textContent = "Picture 2 · Close-up Vein & Mineral Detail";
      if (thumb1) thumb1.classList.remove("active");
      if (thumb2) thumb2.classList.add("active");
    }
  }

  if (thumb1) thumb1.addEventListener("click", () => setPicture(1));
  if (thumb2) thumb2.addEventListener("click", () => setPicture(2));

  if (stagePrevBtn) {
    stagePrevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setPicture(activePicture === 1 ? 2 : 1);
    });
  }
  if (stageNextBtn) {
    stageNextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setPicture(activePicture === 1 ? 2 : 1);
    });
  }

  setPicture(1);

  // 5. Connect Favorites on this page
  const detailFavBtn = document.getElementById("detailFavBtn");
  function syncDetailFavBtn() {
    if (!detailFavBtn || !window.GranTradeFavorites) return;
    const isFav = window.GranTradeFavorites.getAll().some((f) => f.name === stone.name);
    detailFavBtn.setAttribute("aria-pressed", isFav ? "true" : "false");
    const labelEl = detailFavBtn.querySelector("span");
    if (labelEl) labelEl.textContent = isFav ? "Saved to Favorites" : "Save to Favorites";
  }
  if (detailFavBtn) {
    syncDetailFavBtn();
    detailFavBtn.addEventListener("click", () => {
      if (window.GranTradeFavorites) {
        const favMeta = showGt
          ? `${stone.gtNumber} · ${stone.lotNumber} · ${cleanThickness}`
          : `${stone.categoryLabel} · ${stone.lotNumber} · ${cleanThickness}`;
        window.GranTradeFavorites.toggle(
          stone.name,
          favMeta,
          pic1Url
        );
        syncDetailFavBtn();
      }
    });
  }

  window.addEventListener("pageshow", () => {
    syncDetailFavBtn();
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "grantrade_saved_slabs") {
      syncDetailFavBtn();
    } else if (e.key === "granTrade_stone_overrides_v1" && typeof catalog.refresh === "function") {
      catalog.refresh();
      const updated = catalog.getById(stoneId);
      if (updated) {
        if (slabName) slabName.textContent = updated.name;
        if (catBadge) catBadge.textContent = updated.categoryLabel;
        if (slabDesc && updated.description) slabDesc.textContent = updated.description;
      }
    }
  });

  // 6. Populate Related Slabs in same stone family
  const relatedGrid = document.getElementById("relatedGrid");
  if (relatedGrid) {
    const related = catalog.all.filter((s) => s.category === stone.category && s.id !== stone.id).slice(0, 3);
    const relEye = document.getElementById("relatedEyebrow");
    if (relEye) relEye.textContent = stone.categoryLabel;
    const relTitle = document.getElementById("relatedTitle");
    if (relTitle) relTitle.textContent = `More ${stone.categoryLabel} Slabs`;

    related.forEach((rel) => {
      const relUrl = rel.permalink || wpPage(`slab.html?id=${encodeURIComponent(rel.id)}`);
      const relImg = wpAsset(rel.image1 || `assets/images/stone-types/${rel.category}.jpg`);
      const relFallback = wpAsset(`assets/images/stone-types/${rel.category}.jpg`);
      const relShowGt = Boolean(
        rel.gtNumber &&
        (typeof catalog.hasGtNumber === "function"
          ? catalog.hasGtNumber(rel)
          : !["granite", "quartzite", "marble"].includes(String(rel.category || "").toLowerCase()))
      );
      const relMeta = relShowGt ? `${rel.gtNumber} · ${rel.lotNumber}` : rel.lotNumber;

      const card = document.createElement("article");
      card.className = "slab-card";
      card.innerHTML = `
        <div class="sc-media">
          ${relShowGt ? `<span class="cat-badge">${rel.gtNumber}</span>` : ""}
          <img src="${relImg}" alt="${rel.name}" loading="lazy" onerror="this.onerror=null; this.src='${relFallback}';" />
        </div>
        <div class="sc-body">
          <h3 class="sc-title">${rel.name}</h3>
          <div class="sc-meta">${relMeta}</div>
          <p class="sc-desc">${rel.description}</p>
          <div class="sc-specs"><span class="spec-pill">${String(rel.thickness || "3 cm").replace(/\b2\s*cm\s*·\s*3\s*cm/gi, "3 cm").replace(/\bcalibrated\b/gi, "").trim()}</span><span class="spec-pill">${(rel.size || "").split("·")[0].trim()}</span></div>
          <div style="margin-top:1rem;">
            <a href="${relUrl}" class="btn btn-sm btn-primary btn-block">Inspect Slab Details &rarr;</a>
          </div>
        </div>
      `;
      relatedGrid.appendChild(card);
    });
  }
})();

