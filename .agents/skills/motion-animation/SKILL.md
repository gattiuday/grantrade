---
name: motion-animation
description: >-
  Advanced motion design and animation choreography skill. Covers GSAP, ScrollTrigger,
  spring physics, smooth transitions, timeline orchestration, and 60fps hardware-accelerated transforms.
---

# Motion & Animation Engineering

## Core Animation Guidelines

1. **Composite-Only Properties**:
   - ✅ Allowed: `transform` (`translate3d`, `scale`, `rotate`), `opacity`.
   - ❌ Banned: `width`, `height`, `top`, `left`, `margin`, `padding` (causes layout reflow / thrashing).

2. **Easing & Timing Hierarchy**:
   - **Tactile UI Elements (Buttons, Chips, Badges)**:
     - `150ms–200ms` with `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out).
   - **Dialogs, Drawers & Menus**:
     - `250ms–350ms` with `cubic-bezier(0.32, 0.72, 0, 1)` (spring-like deceleration).
   - **Page Transitions & Hero Visualizers**:
     - `500ms–800ms` with smooth continuous choreography.

3. **Scroll Choreography (ScrollTrigger Patterns)**:
   - Use `IntersectionObserver` to trigger `.in-view` state classes rather than listening directly to raw `scroll` events.
   - Separate pin targets from animating child layers to prevent layout jitter.
