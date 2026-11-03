# Gran Trade Inc. — Visual System & Design Tokens (`DESIGN.md`)

## 1. Visual Philosophy & Aesthetic
Gran Trade Inc.'s aesthetic reflects **monumental geology and architectural permanence**. The visual system eschews generic SaaS templates, neon accents, and generic cards in favor of tactile stone textures, alabaster neutrals, and refined warm metallic bronze accents.

## 2. Color Palette & Semantic Tokens

### Light Theme (Natural Alabaster & Raw Mineral)
- `--bg`: `#f6f2ec` — Warm travertine alabaster base
- `--bg-2`: `#efe9df` — Honed limestone secondary surface
- `--surface`: `#fffdf8` — Pure mineral white card surface
- `--surface-hover`: `#ffffff` — Crisp elevated card surface
- `--ink`: `#221d16` — Deep obsidian charcoal text
- `--ink-2`: `#4c453a` — Weathered basalt secondary text
- `--muted`: `#7a7162` — Silicate brown-grey auxiliary notes
- `--line`: `#ddd3c2` — Subtle stone vein border
- `--line-strong`: `#c2b59e` — Calibrated contrast border
- `--accent`: `#8a5a26` — Patina bronze primary accent
- `--accent-hover`: `#a36d33` — Polished amber bronze hover
- `--accent-ink`: `#ffffff` — Accent text on bronze buttons
- `--teal`: `#2f4f4e` — Oceanic mineral dark teal
- `--success`: `#2e6930` — Live yard open indicator green

### Dark Theme (Quarry Granite & Basalt)
- `--bg`: `#171310` — Deep bedrock basalt base
- `--bg-2`: `#1e1915` — Dark slate container surface
- `--surface`: `#221c16` — Elevated volcanic stone card surface
- `--ink`: `#f0e8da` — Polished alabaster white text
- `--ink-2`: `#cfc4b0` — Warm sandstone secondary text
- `--muted`: `#a3967f` — Quartz dust muted label
- `--line`: `#3a3226` — Deep fissure border line
- `--accent`: `#d19a52` — Luminous warm gold / amber bronze

## 3. Typographic Hierarchy
- **Primary Display / Headlines**: `"Marcellus"`, Georgia, "Times New Roman", serif.
  - Classical, chiseled, architectural stone Roman serif character.
  - Used for `h1`, `h2`, `h3`, hero statements, and stone family titles.
- **Body & Technical Specs**: `"Archivo"`, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
  - Industrial grotesque sans-serif engineered for high legibility at micro sizes.
  - Used for GT numbers, lot codes, square footages, dimensions, and filter controls.

## 4. Spacing & Elevation Tokens
- **Borders & Radii**:
  - Cards: `--radius-lg: 14px`
  - Chips / Controls: `--radius-pill: 999px`
  - Inner Spec Boxes: `--radius-sm: 6px`
- **Shadows**:
  - `--shadow-sm`: `0 2px 6px rgba(46, 36, 22, 0.05)`
  - `--shadow-md`: `0 10px 25px rgba(46, 36, 22, 0.08)`
  - `--shadow-lg`: `0 18px 45px rgba(46, 36, 22, 0.14)`

## 5. Anti-Pattern Guardrails (Anti-AI-Slop Checklist)
- ❌ **No Generic Gradients**: Never use purple-to-blue or rainbow gradients.
- ❌ **No Inter Everywhere**: Headings must use `Marcellus`; specs must use `Archivo`.
- ❌ **No Dead Images**: Every stone media element must have an automatic fallback to its family stone photograph (`assets/images/stone-types/<family>.jpg`).
- ❌ **No Retail CTAs**: Never insert "Request an instant quote" or retail cart widgets.
- ❌ **No Broken Search**: All 50 inventory stones must be searchable by name, GT#, lot#, and category.

## 6. Taste Skill Parameters (`Leonxlnx/taste-skill`)
- **Archetype**: *Luxury Monumental & Raw Mineral*
- **Design Read**: High-end architectural stone distributor; authentic, physical, authoritative, tactile, trade-focused.
- **`DESIGN_VARIANCE` (5 / 10)**: Structural balance combining symmetrical catalog grids with asymmetric hero viewers and multi-height gallery compositions.
- **`MOTION_INTENSITY` (3 / 10)**: Subtle, physics-grounded transitions (0.15s–0.25s), smooth drawer choreography, zero gratuitous scroll-jacking, fully reduced-motion compliant.
- **`VISUAL_DENSITY` (6 / 10)**: Balanced trade catalog density; technical specifications (GT#, Lot#, size, thickness) formatted cleanly without visual crowding.


