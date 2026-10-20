/**
 * GRAN TRADE INC. — NAVIGATION & STATUS MODULE (1/5)
 * Job: Mobile menu toggle, active link detection, live America/New_York yard status
 */

(function () {
  "use strict";

  // ---------------- 1. Mobile Menu Toggle ----------------
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close when clicking a link inside mobile drawer
    mainNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        mainNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // ---------------- 2. Active Page Highlighting ----------------
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const pageFilename = currentPath.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-link").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkFilename = href.split("/").pop();

    if (
      linkFilename === pageFilename ||
      (pageFilename === "" && linkFilename === "index.html") ||
      (pageFilename === "index.html" && linkFilename === "index.html")
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  // ---------------- 3. Live Yard Open-Now Indicator (America/New_York) ----------------
  // Schedule: 0=Sun (Closed), 1-5=Mon-Fri (8:00 - 18:00), 6=Sat (9:00 - 14:00)
  const SCHEDULE = {
    0: null,
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
          // Find next open day
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
})();
