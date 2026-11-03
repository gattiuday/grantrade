---
name: claudedesignskills
description: >-
  Modern Design Agency Skillstack and Creative Engineering Toolkit. Covers 3D graphics (Three.js, WebGL),
  motion choreography (GSAP, ScrollTrigger, Framer Motion), interactive micro-interactions,
  and production-grade creative web development.
---

# Claude Design Skills — Creative Agency Skillstack

`claudedesignskills` brings agency-grade creative engineering, 3D WebGL rendering, and motion choreography into the AI agent workflow.

---

## 1. Skill Categories & Capabilities

### A. 3D & WebGL Graphics
- **Three.js & WebGL**: Interactive slab/mesh rendering, custom shaders, normal/roughness stone maps, environmental lighting, and orbit inspection.
- **Performance Budget**: Target constant 60 FPS on mobile and desktop, instantiate geometry once, share materials, and handle WebGL context loss gracefully.
- **Canvas Fallback**: Seamless graceful degradation to 2D high-res canvas or responsive picture tags on low-power devices.

### B. Motion Design & Animation
- **GSAP & ScrollTrigger**: Choreographed scrub animations, pinned stages, parallax layer pacing, and magnetic interaction triggers.
- **Hardware Acceleration**: Only animate composite properties (`transform: translate3d/scale/rotate`, `opacity`). Never animate layout triggers (`top`, `left`, `width`, `height`, `margin`).
- **Tactile Micro-Interactions**: Spring physics, smooth hover lifts, magnetic buttons, cursor followers, and progressive disclosure drawers.

### C. Creative Web Components
- **Liquid Flow Grids**: Fluid responsive card rhythm, dynamic aspect-ratio preserving stages, and smooth modal overlays.
- **Macro Zoom Viewers**: Interactive multi-view state machines (full view, 2.3x macro surface inspection, installed context).

---

## 2. Creative Engineering Standards

1. **Strict 60 FPS Floor**:
   - Use `transform: translate3d(0, 0, 0)` or `will-change: transform` on animated elements.
   - Throttle resize and scroll listeners via `requestAnimationFrame` or `IntersectionObserver`.
2. **Accessibility & Motion Preference**:
   - Always honor `@media (prefers-reduced-motion: reduce)`:
     ```css
     @media (prefers-reduced-motion: reduce) {
       *, *::before, *::after {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
         scroll-behavior: auto !important;
       }
     }
     ```
3. **Clean Vanilla & Zero Bloat**:
   - Favor native CSS custom properties and standard Web APIs (Web Animations API, Intersection Observer, Resize Observer) over heavy external dependencies when possible.

