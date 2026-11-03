---
name: taste-skill
description: >-
  The Anti-Slop Frontend Framework for AI Agents. Enforces art direction,
  brief inference, the three tuning dials (design variance, motion intensity, visual density),
  strict anti-slop bans, and pre-flight visual verification before shipping code.
---

# Taste Skill — Anti-Slop Frontend Framework

Taste Skill stops AI coding agents from generating generic, template-driven "AI slop" (uniform 3-card feature rows, unmotivated purple gradients, standard Inter-only typography, and cliché layouts). It forces deliberate art direction, context inference, and disciplined craftsmanship.

---

## 1. Step 0: Brief Inference & The "Design Read"

Before writing or editing any frontend code, output a concise **Design Read** summarizing:
- **Archetype / Vibe**: (e.g., *Luxury Monumental*, *Editorial Document*, *High-Density Cockpit*, *Restrained Brutalist*).
- **Target Audience**: Who is using the interface and what do they care about most?
- **Tone**: How should the interface feel? (e.g., tactile, authoritative, calm, dense).

---

## 2. The Three Tuning Dials (Scale 1–10)

Set explicit dial values based on the project's archetype:

| Dial | Scale (1–10) | Low (1–3) | Balanced (4–6) | High (7–10) |
| :--- | :--- | :--- | :--- | :--- |
| **`DESIGN_VARIANCE`** | Layout unpredictability & asymmetry | Strict symmetric grid, corporate alignment | Intentional asymmetry, staggered cards, mixed scales | Avant-garde, broken-grid, brutalist overlap |
| **`MOTION_INTENSITY`** | Animation energy & choreography | Tactile hover-only, micro-state changes | Smooth spring transitions, drawer slides | Cinematic scroll-driven scenes, particle canvas |
| **`VISUAL_DENSITY`** | Information compactness vs whitespace | Airy gallery whitespace, oversized margins | Balanced catalog spacing, clean cards | Tight data table, cockpit dashboard density |

---

## 3. Strict Anti-Slop Bans

### 🚫 Banned Visual Clichés
- **No Purple-to-Blue Gradients**: Do not use neon radial glows, purple drop shadows, or generic AI-gradient hero backgrounds. Every color must belong to an intentional palette.
- **No Symmetrical 3-Card Feature Rows**: Avoid the classic "3 identical cards with centered icons and bold subheadings." Introduce variance: feature cards, split hero media, stat blocks, or asymmetric lists.
- **No Unmotivated Badge Pills**: Do not slap rounded pill badges with generic copy (`✨ Introducing New AI Feature`) at the top of every section.
- **No Generic Inter-Only Typography**: Use deliberate font pairings (e.g., a chiseled Roman serif for headlines paired with a high-legibility technical sans for data).

### 🚫 Banned Copy Tropes
- **No Em-Dashes (`—`) in Display Headlines & Eyebrows**: Replace decorative em-dashes with crisp periods, colons, or clean architectural line breaks.
- **No Vague SaaS Buzzwords**: Ban empty fluff like *"Supercharge your workflow"*, *"Revolutionize your pipeline"*, or *"Unleash the power"*. Use authentic, domain-specific terminology.

---

## 4. Pre-Flight Verification Checklist

Before considering frontend code complete:
1. **Contrast & Legibility**: Verify WCAG AA compliance for text against all surface backgrounds.
2. **Responsive Resilience**: Check 375px (Mobile), 768px (Tablet), and 1280px+ (Desktop). No horizontal scroll bleed, no overlapping elements, no clipped labels.
3. **Interactive Completeness**: Every button, card, and tab must have distinct hover, focus-visible, and active feedback states.
4. **Media Resilience**: All images must feature fallback handlers (`onerror`) to prevent broken image icons.
5. **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions.

