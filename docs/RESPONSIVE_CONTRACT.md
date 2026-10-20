# Gran Trade Inc. — Responsive Contract Specification

This document outlines the layout rules, breakpoint thresholds, fluid typography curves, touch target standards, and mobile drawer interaction contracts enforced across the Gran Trade Inc. website for **Mobile**, **Tablet**, and **Laptop**.

---

## 1. Breakpoint Grid System

The responsive contract is defined across five standard viewport thresholds:

| Breakpoint Tier | Media Query | Target Devices | Grid Columns (Slab Catalog) |
| :--- | :--- | :--- | :---: |
| **Desktop Wide / Laptop** | `> 1024px` | Large desktop monitors, MacBook Pro/Air, 1080p/4K displays | 3–4 Columns |
| **Tablet Landscape** | `769px – 1024px` | iPad Pro, iPad Air landscape, Surface Pro | 2 Columns |
| **Tablet Portrait** | `641px – 768px` | iPad Mini, iPad Air portrait, medium tablets | 2 Columns |
| **Mobile Standard** | `≤ 640px` | iPhone 14/15/16, Google Pixel, Galaxy | 1 Column |

---

## 2. Fluid Typography & Spacing Contract

Rather than abrupt step-function jumps at arbitrary pixel widths, major headings and container paddings scale smoothly using CSS `clamp()` formulas:

```css
/* Display Heading 1 */
h1 {
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.15;
}

/* Section Heading 2 */
h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.75rem);
  line-height: 1.2;
}

/* Card Heading 3 */
h3 {
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  line-height: 1.25;
}

/* Container Horizontal Gutters */
.container {
  padding-left: clamp(1rem, 3.5vw, 2.5rem);
  padding-right: clamp(1rem, 3.5vw, 2.5rem);
}

/* Section Vertical Padding */
.section {
  padding-top: clamp(3.5rem, 6vw, 6.5rem);
  padding-bottom: clamp(3.5rem, 6vw, 6.5rem);
}
```

---

## 3. Touch Target Standards (WCAG 2.1 AA Compliance)

On touch devices (viewport `≤ 640px`), every interactive element is required to meet the **minimum 44x44 CSS pixel bounding box**:
- **Buttons (`.btn`, `.tab-btn`)**: Minimum height of `44px` with horizontal padding of at least `1rem`.
- **Heart Favorite Button (`.heart`)**: Sized at `38x38px` with an expanded touch hitbox reaching `44x44px` minimum.
- **Filter Dropdown Selects (`.filter-select`)**: Full width on mobile with `min-height: 48px` and `font-size: 16px` to prevent iOS Safari auto-zooming.
- **Navigation Toggle Button (`.menu-toggle`)**: Guaranteed `min-width: 44px` and `min-height: 44px`.
- **Drawer Close Buttons (`.drawer-close`, `.fav-remove`)**: Touch target area padded to exceed 44px.

---

## 4. Mobile & Tablet Navigation Drawer Contract

At viewport widths `≤ 960px`:
1. The desktop navigation links (`.nav-links`) hide to prevent link wrapping on iPad portrait screens.
2. The hamburger button (`#menuBtn`) becomes visible with `aria-expanded="false"`.
3. Toggling `#menuBtn` transitions the mobile navigation drawer (`#mainNav`) downwards using hardware-accelerated transforms:
   ```css
   .main-nav {
     position: fixed;
     top: 66px;
     inset-inline: 0;
     bottom: 0;
     transform: translateY(-100%);
     transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s;
   }
   .main-nav.open {
     transform: translateY(0);
     opacity: 1;
     visibility: visible;
   }
   ```
4. Clicking any internal link or pressing the `Escape` key automatically closes the menu and returns `aria-expanded` to `false`.

---

## 5. Favorites Slide-Out Drawer Contract

The favorites drawer (`#favDrawer`) behaves consistently across all device form factors:
- **Desktop (`> 640px`)**: Fixed width of `440px`, pinned to the right edge. Slides in from `translateX(100%)` to `translateX(0)`.
- **Mobile (`≤ 640px`)**: Full viewport width (`width: 100vw`). Covers the screen cleanly with backdrop blur (`#scrim`).
- **Focus Trap & ESC Key**: Pressing `Escape` or tapping the background backdrop scrim immediately triggers smooth dismissal.

---

## 6. Layout Transitions Summary

| Component | Desktop / Laptop (`> 1024px`) | Tablet (`641px – 1024px`) | Mobile (`≤ 640px`) |
| :--- | :--- | :--- | :--- |
| **3-Picture Viewer** | Side-by-side (1.4fr stage : 1fr controls) | Stacked stage over controls (16:9) | Stacked, 1-col buttons |
| **Hero Metrics** | 3-Column horizontal strip | 3-Column compact strip | 1-Column vertical list |
| **Why Grid** | 4-Column card row | 2x2 Grid | 1-Column stacked cards |
| **Showroom Gallery** | Tall featured image + 2x2 image stack | Stacked featured image + 2-col stack | Single column vertical feed |
| **Contact Page** | 1fr info panel : 1.15fr inquiry form | Stacked info over form | Stacked single column |
| **Category Tabs Rail** | Centered wrapped tabs | Horizontally scrollable smooth rail | Scrollable touch rail (no scrollbars) |
| **Footer** | 4 Columns (Brand + 3 Link columns) | 2 Columns (Brand spans 2) | 1 Column stacked |

---

## 7. Reduced Motion Support

For users with motion sensitivities or vestibulopathy, `@media (prefers-reduced-motion: reduce)` disables non-essential animations:
- CSS transitions and transforms drop to `0.01ms`.
- Image zoom on the 3-picture viewer switches instantly without zooming animation.
- Pulsing green yard dot remains static green without scale oscillation.
- Smooth scroll behavior reverts to standard instant jump.
