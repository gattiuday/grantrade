---
name: impeccable
description: >-
  Frontend design director skill and design vocabulary. Use when auditing,
  critiquing, polishing, refining typography, colorizing, hardening, or
  elevating UI and web craft. Eliminates AI slop, generic cards, and weak hierarchy.
---

# Impeccable — Frontend Design Craft & Guardrails

Impeccable steers coding agents toward award-winning, production-grade frontend execution, banishing generic templates ("AI slop", default Inter font everywhere, random purple gradients, and cards nested in cards).

## Core Principles

1. **Craft Over Default**: Never settle for generic frameworks or placeholder aesthetics. Every color, font weight, margin, and border radius must feel intentional.
2. **Context-Driven Design**: Always inspect `PRODUCT.md` and `DESIGN.md` in the project root before making visual changes to maintain brand cohesion.
3. **Bounded Verification**: Always verify visual changes across responsive viewports (Mobile 375px, Tablet 768px, Desktop 1280px+), check contrast ratios (WCAG AA minimum), and confirm zero layout shifts (CLS).
4. **Mechanical Anti-Pattern Elimination**:
   - No generic purple-to-blue gradients unless explicitly requested.
   - No repetitive card-in-card nesting without clear hierarchical distinction.
   - No unstyled text overflows, unhandled image loading failures, or missing interactive states (hover, focus-visible, active).

## Command Vocabulary

- `/impeccable init` — Scan codebase and generate `PRODUCT.md` and `DESIGN.md`.
- `/impeccable critique` — Conduct a structured UX and aesthetic review scored against heuristics.
- `/impeccable audit` — Run a technical quality, accessibility, contrast, and performance audit.
- `/impeccable polish` — Perform a final pixel-alignment and visual refinement pass before shipping.
- `/impeccable bolder` — Inject distinctive character, increase contrast, punch up typography.
- `/impeccable quieter` — Strip visual noise, soften harsh borders, establish calming whitespace.
- `/impeccable distill` — Remove redundant elements, simplify flows, focus purely on core intent.
- `/impeccable typeset` — Fine-tune font pairing, typographic scale, leading, and tracking.
- `/impeccable layout` — Align grids, balance whitespace, normalize rhythm and padding tokens.
- `/impeccable colorize` — Apply an intentional, harmonious palette rooted in brand identity.
- `/impeccable animate` — Add subtle, purposeful transitions and tactile micro-interactions.
- `/impeccable harden` — Handle edge cases, empty states, long text strings, and offline fallbacks.
- `/impeccable adapt` — Perfect responsive behavior across mobile, tablet, and wide desktop screens.
