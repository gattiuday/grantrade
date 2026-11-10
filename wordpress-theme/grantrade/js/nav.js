/**
 * GRAN TRADE INC. — NAVIGATION & STATUS MODULE (1/5)
 * Job: Mobile/tablet menu toggle, active link detection, live America/New_York yard status
 */

(function () {
  "use strict";

  // ---------------- 0. Reset Scroll to Top on Refresh / Page Load ----------------
  if ("scrollRestoration" in window.history) {
    try {
      window.history.scrollRestoration = "manual";
    } catch (_) {}
  }

  function isReloadNavigation() {
    try {
      if (window.performance && typeof window.performance.getEntriesByType === "function") {
        const nav = window.performance.getEntriesByType("navigation")[0];
        if (nav) return nav.type === "reload";
      }
      if (window.performance && window.performance.navigation) {
        return window.performance.navigation.type === 1;
      }
    } catch (_) {}
    return false;
  }

  function scrollToTopInstant() {
    try {
      const htmlEl = document.documentElement;
      const prevBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      htmlEl.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      htmlEl.style.scrollBehavior = prevBehavior;
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }

  const shouldForceTopOnBoot = !window.location.hash || isReloadNavigation();
  if (shouldForceTopOnBoot) {
    scrollToTopInstant();
    document.addEventListener("DOMContentLoaded", function () {
      scrollToTopInstant();
      requestAnimationFrame(scrollToTopInstant);
    });
    window.addEventListener("load", function () {
      scrollToTopInstant();
      requestAnimationFrame(scrollToTopInstant);
      setTimeout(scrollToTopInstant, 0);
    });
  }

  window.addEventListener("pageshow", function (e) {
    if (e.persisted || isReloadNavigation() || !window.location.hash) {
      scrollToTopInstant();
      requestAnimationFrame(scrollToTopInstant);
    }
  });

  window.addEventListener("beforeunload", function () {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (_) {}
    }
    scrollToTopInstant();
  });

  window.addEventListener("pagehide", function () {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (_) {}
    }
    scrollToTopInstant();
  });

  // ---------------- 1. Mobile & Tablet Menu Toggle ----------------
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  const ICON_HAMBURGER = `
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  `;

  const ICON_CLOSE = `
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;

  function setMenuButtonState(isOpen) {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Toggle navigation menu");
    menuBtn.innerHTML = isOpen ? ICON_CLOSE : ICON_HAMBURGER;
  }

  function openMenu() {
    if (!mainNav) return;
    const favDrawer = document.getElementById("favDrawer");
    if (favDrawer && favDrawer.classList.contains("open") && window.GranTradeFavorites && typeof window.GranTradeFavorites.close === "function") {
      window.GranTradeFavorites.close();
    }
    mainNav.classList.add("open");
    setMenuButtonState(true);
    document.body.style.overflow = "hidden";
  }

  function closeMenu(returnFocus) {
    if (!mainNav) return;
    const wasOpen = mainNav.classList.contains("open");
    mainNav.classList.remove("open");
    setMenuButtonState(false);

    const favDrawer = document.getElementById("favDrawer");
    if (!favDrawer || !favDrawer.classList.contains("open")) {
      document.body.style.overflow = "";
    }

    if (wasOpen && returnFocus && menuBtn) {
      menuBtn.focus();
    }
  }

  function toggleMenu() {
    if (!mainNav) return;
    if (mainNav.classList.contains("open")) {
      closeMenu(false);
    } else {
      openMenu();
    }
  }

  if (menuBtn && mainNav) {
    // Inject helpful yard status & call CTA inside mobile/tablet drawer
    if (!mainNav.querySelector(".mobile-drawer-meta")) {
      const drawerMeta = document.createElement("div");
      drawerMeta.className = "mobile-drawer-meta";
      drawerMeta.innerHTML = `
        <div class="open-indicator">
          <span class="open-dot"></span>
          <span class="open-text">Checking yard hours...</span>
        </div>
        <a href="tel:2014381888" class="btn btn-secondary mobile-drawer-call">Call Yard: (201) 438-1888</a>
      `;
      mainNav.appendChild(drawerMeta);
    }

    setMenuButtonState(false);

    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking any link inside mobile drawer
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        closeMenu(false);
      }
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!mainNav.classList.contains("open")) return;
      if (mainNav.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu(false);
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mainNav.classList.contains("open")) {
        closeMenu(true);
      }
    });

    // Automatically close mobile drawer if viewport expands past 960px
    const desktopMq = window.matchMedia("(min-width: 961px)");
    const handleViewportChange = function (mqEvent) {
      if (mqEvent.matches && mainNav.classList.contains("open")) {
        closeMenu(false);
      }
    };
    if (typeof desktopMq.addEventListener === "function") {
      desktopMq.addEventListener("change", handleViewportChange);
    } else if (typeof desktopMq.addListener === "function") {
      desktopMq.addListener(handleViewportChange);
    }
  }

  window.GranTradeNav = {
    openMenu: openMenu,
    closeMenu: closeMenu,
    toggleMenu: toggleMenu,
  };

  // ---------------- 2. Active Page Highlighting ----------------
  const normalizePath = function (pathname) {
    let p = (pathname || "/").replace(/\/+$/, "");
    if (!p || p === "/index.html") return "/";
    return p.replace(/\.html$/i, "");
  };
  const currentNorm = normalizePath(window.location.pathname);

  document.querySelectorAll(".nav-links a, .nav-link").forEach(function (link) {
    link.classList.add("nav-link");
    const li = link.closest("li");
    if (li && (li.classList.contains("current-menu-item") || li.classList.contains("current_page_item"))) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
      return;
    }

    try {
      const linkUrl = new URL(link.getAttribute("href") || "", window.location.href);
      if (linkUrl.origin === window.location.origin && normalizePath(linkUrl.pathname) === currentNorm) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        return;
      }
    } catch (_) {}

    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  // ---------------- 3. Live Yard Open-Now Indicator (America/New_York) ----------------
  // Schedule: 0=Sun (10:00 - 14:00), 1-5=Mon-Fri (8:00 - 18:00), 6=Sat (9:00 - 14:00)
  const SCHEDULE = {
    0: [10, 14],
    1: [8, 18],
    2: [8, 18],
    3: [8, 18],
    4: [8, 18],
    5: [8, 18],
    6: [9, 14],
  };

  function formatHour(h) {
    const hr = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 || h === 24 ? "AM" : "PM";
    return `${hr}:00 ${ampm}`;
  }

  function updateYardStatus() {
    try {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
      const day = now.getDay();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const todayHours = SCHEDULE[day];

      const isOpen = todayHours && currentMinutes >= todayHours[0] * 60 && currentMinutes < todayHours[1] * 60;

      const dotEls = document.querySelectorAll(".open-dot");
      const textEls = document.querySelectorAll(".open-text");
      const headerPill = document.getElementById("headerYardStatus");

      let statusLabel = "";
      let shortLabel = "";

      if (isOpen) {
        dotEls.forEach((dot) => dot.classList.remove("closed"));
        statusLabel = `Yard open now · closes ${formatHour(todayHours[1])} ET`;
        shortLabel = `Open now · closes ${formatHour(todayHours[1])}`;
      } else {
        dotEls.forEach((dot) => dot.classList.add("closed"));
        if (todayHours && currentMinutes < todayHours[0] * 60) {
          statusLabel = `Opens today at ${formatHour(todayHours[0])} ET`;
          shortLabel = `Opens today ${formatHour(todayHours[0])}`;
        } else {
          for (let d = 1; d <= 7; d++) {
            const nextDay = (day + d) % 7;
            if (SCHEDULE[nextDay]) {
              const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              statusLabel = `Opens ${dayNames[nextDay]} at ${formatHour(SCHEDULE[nextDay][0])} ET`;
              shortLabel = `Opens ${dayNames[nextDay]} ${formatHour(SCHEDULE[nextDay][0])}`;
              break;
            }
          }
        }
      }

      textEls.forEach((el) => {
        el.textContent = statusLabel;
      });

      if (headerPill) {
        headerPill.textContent = shortLabel;
      }

      // Highlight current day in hours table
      document.querySelectorAll("#hoursTable tr[data-day]").forEach(function (row) {
        const rowDay = parseInt(row.getAttribute("data-day"), 10);
        if (rowDay === day) {
          row.classList.add("today");
        } else {
          row.classList.remove("today");
        }
      });
    } catch (err) {
      console.warn("Timezone check fallback:", err);
    }
  }

  updateYardStatus();
  // Refresh status every 60 seconds
  setInterval(updateYardStatus, 60000);

  // ---------------- 4. Social Profile Links (Facebook, Houzz, Instagram, Yelp) ----------------
  function renderStaticSocialLinks() {
    const html = `
      <div class="social-links-row" aria-label="Social profiles">
        <a href="https://www.facebook.com/grantradeinc/" target="_blank" rel="noopener noreferrer" class="social-link-pill">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H7.7v3h2.6v8h3.2z"/></svg>
          <span>Facebook</span>
        </a>
        <a href="https://www.houzz.com/hznb/professionals/building-supplies/gran-trade-inc-pfvwus-pf~1639963827" target="_blank" rel="noopener noreferrer" class="social-link-pill">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.3 3L5 7.2V21h5.2v-5.7h3.6V21H19v-8.8L12.3 3z"/></svg>
          <span>Houzz</span>
        </a>
        <a href="https://www.instagram.com/grantradeinc/?hl=en" target="_blank" rel="noopener noreferrer" class="social-link-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          <span>Instagram</span>
        </a>
        <a href="https://www.yelp.com/biz/gran-trade-carlstadt-5?osq=Gran+Trade" target="_blank" rel="noopener noreferrer" class="social-link-pill">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.1 2.2c-.5 0-.9.4-.9.9v6.2c0 .6.6 1 1.1.8l1.6-.6c.5-.2.7-.8.5-1.3l-1.5-5.3c-.1-.4-.4-.7-.8-.7zm-1.9 9.7l-5.3-1.4c-.5-.1-1 .3-.9.9l.4 2c.1.4.4.7.8.8l4.9 1.1c.6.1 1.1-.4 1-1l-.2-1.6c-.1-.4-.4-.7-.7-.8zm4.2.5c-.5.2-.7.8-.4 1.3l2.6 4.4c.3.4.8.5 1.2.2l1.6-1.2c.3-.3.4-.8.2-1.2l-3-4.1c-.3-.4-.9-.5-1.3-.3l-.9.9zm-3.6 3.2l-3.7 3.7c-.4.4-.3 1 .1 1.3l1.7 1c.4.2.9.1 1.2-.2l2.9-3.9c.3-.5.1-1.1-.4-1.4l-1.1-.6c-.3-.1-.5-.1-.7.1zm5-3.8c.5 0 1 .4 1 .9l-.2 2.1c0 .4-.4.8-.8.8l-5.3.2c-.6 0-1-.6-.8-1.1l.6-1.4c.1-.4.5-.6.9-.7l4.6-.8z"/></svg>
          <span>Yelp</span>
        </a>
      </div>
    `;

    const footerBrand = document.querySelector(".footer-brand");
    if (footerBrand && !footerBrand.querySelector(".social-links-row")) {
      footerBrand.insertAdjacentHTML("beforeend", html);
    }

    const contactMount = document.getElementById("contactSocialMount");
    if (contactMount && !contactMount.querySelector(".social-links-row")) {
      contactMount.innerHTML = html;
    }
  }
  renderStaticSocialLinks();
})();
