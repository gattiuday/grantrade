/**
 * GRAN TRADE INC. — FAVORITES MODULE (5/5)
 * Job: Persistent client-side favorites (localStorage), heart sync, sliding drawer UI
 */

(function () {
  "use strict";

  const STORAGE_KEY = "grantrade_saved_slabs";
  let favorites = [];

  // DOM Elements
  const favCountBadges = document.querySelectorAll(".fav-badge");
  const favBody = document.getElementById("favBody");
  const drawer = document.getElementById("favDrawer");
  const scrim = document.getElementById("scrim");
  const favOpenBtn = document.getElementById("favOpen");
  const favCloseBtn = document.getElementById("favClose");

  // Load from localStorage
  function loadFavorites() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        favorites = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("localStorage not available, using in-memory store:", e);
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn("Failed saving favorites:", e);
    }
  }

  function findIndex(name) {
    return favorites.findIndex((item) => item.name === name);
  }

  function updateBadgeCounts() {
    favCountBadges.forEach((badge) => {
      badge.textContent = favorites.length;
      badge.style.display = favorites.length > 0 ? "inline-flex" : "none";
    });
  }

  function renderDrawer() {
    if (!favBody) return;

    if (favorites.length === 0) {
      favBody.innerHTML = `
        <div class="drawer-empty">
          <svg style="width:36px; height:36px; margin:0 auto 12px; color:var(--muted); opacity:0.6;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p><strong>No slabs saved yet.</strong></p>
          <p style="font-size:0.85rem; margin-top:6px;">Tap the heart on any slab to save it here for your warehouse visit or fabricator consultation.</p>
        </div>
      `;
      return;
    }

    favBody.innerHTML = "";
    favorites.forEach((item) => {
      const row = document.createElement("div");
      row.className = "fav-item";

      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.name;

      const info = document.createElement("div");
      info.className = "fav-item-info";

      const name = document.createElement("div");
      name.className = "fi-name";
      name.textContent = item.name;

      const meta = document.createElement("div");
      meta.className = "fi-meta";
      meta.textContent = item.meta || "";

      info.appendChild(name);
      info.appendChild(meta);

      const removeBtn = document.createElement("button");
      removeBtn.className = "fav-remove";
      removeBtn.type = "button";
      removeBtn.innerHTML = "&times;";
      removeBtn.setAttribute("aria-label", `Remove ${item.name} from saved slabs`);
      removeBtn.addEventListener("click", () => {
        toggleFavorite(item.name, item.meta, item.img);
      });

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(removeBtn);
      favBody.appendChild(row);
    });
  }

  function syncCardHearts() {
    document.querySelectorAll(".slab-card").forEach((card) => {
      const cardName = card.getAttribute("data-name");
      const heartBtn = card.querySelector(".heart");
      if (!heartBtn) return;

      const isFav = favorites.some((f) => f.name === cardName);
      heartBtn.classList.toggle("active", isFav);
      heartBtn.setAttribute("aria-pressed", isFav ? "true" : "false");
      heartBtn.setAttribute("aria-label", isFav ? `Remove ${cardName} from favorites` : `Save ${cardName} to favorites`);

      const svg = heartBtn.querySelector("svg");
      if (svg) {
        svg.setAttribute("fill", isFav ? "currentColor" : "none");
      }
    });
  }

  function toggleFavorite(name, meta, img) {
    const idx = findIndex(name);
    if (idx !== -1) {
      favorites.splice(idx, 1);
    } else {
      favorites.push({ name, meta, img });
    }

    saveFavorites();
    updateBadgeCounts();
    renderDrawer();
    syncCardHearts();
  }

  function openDrawer() {
    if (!drawer || !scrim) return;
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      drawer.classList.add("open");
      scrim.classList.add("open");
    });
    if (favCloseBtn) favCloseBtn.focus();
  }

  function closeDrawer() {
    if (!drawer || !scrim) return;
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
      drawer.hidden = true;
    }, 280);
  }

  // Setup Event Listeners
  if (favOpenBtn) favOpenBtn.addEventListener("click", openDrawer);
  if (favCloseBtn) favCloseBtn.addEventListener("click", closeDrawer);
  if (scrim) scrim.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && !drawer.hidden && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  // Attach click to all card hearts in DOM
  document.addEventListener("click", (e) => {
    const heart = e.target.closest(".heart");
    if (!heart) return;

    const card = heart.closest(".slab-card");
    if (!card) return;

    const name = card.getAttribute("data-name");
    const meta = card.getAttribute("data-meta") || "";
    const imgTag = card.querySelector("img");
    const img = imgTag ? imgTag.getAttribute("src") : "";

    toggleFavorite(name, meta, img);
  });

  // Init
  loadFavorites();
  updateBadgeCounts();
  renderDrawer();
  syncCardHearts();

  // Expose global API
  window.GranTradeFavorites = {
    toggle: toggleFavorite,
    open: openDrawer,
    close: closeDrawer,
    getAll: () => [...favorites],
  };
})();
