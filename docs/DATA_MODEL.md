# Gran Trade Inc. — Data Model Specification

This document defines the schema, field types, enumeration values, and validation contracts for `data/products.json` — the catalog's **single source of truth**.

---

## 1. Schema Overview

`data/products.json` contains a flat JSON array of product objects representing every natural and engineered stone slab, tile, and monument available in Gran Trade's inventory.

```json
[
  {
    "id": "calacatta-alps",
    "name": "Calacatta Alps",
    "category": "quartz",
    "categoryLabel": "Gran Trade Quartz",
    "type": "engineered",
    "meta": "Gran Trade Quartz · Calacatta Alps",
    "colors": ["white", "grey"],
    "colorLabel": "White, Grey",
    "finishes": ["polished"],
    "thicknesses": ["2", "3"],
    "thicknessLabel": "2 cm · 3 cm",
    "origin": "Engineered (USA / Global)",
    "application": "Kitchen countertops, bathroom vanities, commercial bar tops",
    "description": "Crisp white background crossed with soft, sweeping alpine grey veining. Non-porous engineered surface requiring zero sealing.",
    "featured": false,
    "image": "assets/images/products/calacatta-alps.jpg",
    "inStock": true
  }
]
```

---

## 2. Field Definitions & Types

| Field | Type | Required | Description | Example |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | **Yes** | Unique kebab-case slug identifier. | `"aquamarine-quartzite"` |
| `name` | `string` | **Yes** | Commercial stone trade name. | `"Aquamarine Quartzite"` |
| `category` | `string` | **Yes** | Internal taxonomy key for tab filtering. | `"quartzite"` |
| `categoryLabel` | `string` | **Yes** | Human-readable stone family display name. | `"Exotic Quartzite"` |
| `type` | `string` | **Yes** | High-level material type: `"natural"` or `"engineered"`. | `"natural"` |
| `meta` | `string` | **Yes** | Pre-formatted secondary display string for cards and drawers. | `"Exotic Quartzite · Brazil"` |
| `colors` | `string[]` | **Yes** | Array of normalized color tags for multi-select filtering. | `["blue", "green", "grey"]` |
| `colorLabel` | `string` | No | Formatted comma-separated color display string. | `"Blue, Green, Grey"` |
| `finishes` | `string[]` | **Yes** | Available surface machine treatments. | `["polished", "leather", "honed"]` |
| `thicknesses` | `string[]` | **Yes** | Calibrated slab thickness options in cm or tile. | `["2", "3"]` |
| `thicknessLabel` | `string` | **Yes** | Human-readable thickness pill display string. | `"2 cm · 3 cm"` |
| `origin` | `string` | **Yes** | Quarry source country or production region. | `"Brazil (Bahia)"` |
| `application` | `string` | No | Recommended architectural usage. | `"Waterfalls, islands, fireplace walls"` |
| `description` | `string` | **Yes** | Concise stone profile covering coloration, veining, and density. | `"Teal-green oceanic field with crystal fissures."` |
| `featured` | `boolean` | **Yes** | Flag indicating inclusion in homepage curated preview. | `true` |
| `image` | `string` | **Yes** | Relative path to high-resolution product photography. | `"assets/images/products/aquamarine-quartzite.webp"` |
| `inStock` | `boolean` | **Yes** | Inventory availability status at Carlstadt yard. | `true` |

---

## 3. Allowed Enumeration Values

### `category` Enum Values
- `"quartz"`: Gran Trade Quartz (Engineered surfacing)
- `"granite"`: Natural Granite (Igneous natural stone)
- `"marble"`: Fine Marble (Metamorphic limestone)
- `"quartzite"`: Exotic Quartzite (Metamorphic quartz sandstone)
- `"monuments"`: Civic & Memorial Monuments (Dense structural granite)
- `"semi"`: Semi Precious Stone (Agate, crystal geode slabs)
- `"soapstone"`: Natural Soapstone (Steatite talc stone)
- `"tile"`: Architectural Tile (Tumbled/honed travertine and marble tile)

### `type` Enum Values
- `"natural"`: Mined directly from geological quarry blocks.
- `"engineered"`: Manufactured composite containing 90%+ pure quartz crystals bound in polymer resins.

### `colors` Enum Values
- `"white"`
- `"grey"`
- `"black"`
- `"blue"`
- `"gold"`
- `"cream"`
- `"green"`
- `"brown"`
- `"red"`

### `finishes` Enum Values
- `"polished"`: Mirror-gloss diamond polish highlighting mineral crystalline depth.
- `"leather"`: Matte, textured, undulating tactile finish created by abrasive diamond brushes.
- `"honed"`: Satin-smooth, low-sheen matte surface that softens reflections.

### `thicknesses` Enum Values
- `"2"`: 2 centimeter nominal slab thickness (standard for vertical cladding and laminated edges).
- `"3"`: 3 centimeter nominal slab thickness (preferred Northeast standard for self-supporting countertops).
- `"tile"`: 1.0 cm to 1.2 cm calibrated tile format.

---

## 4. How to Add a New Stone Bundle to `products.json`

When a new container arrives from an overseas quarry partner:
1. Photograph the front slab of the bundle under clean warehouse lighting.
2. Optimize the image (JPEG or WebP, approximately 1200x900px, under 250KB) and place it in:
   `assets/images/products/<stone-slug>.jpg`
3. Append a new product object to `data/products.json`:
   ```json
   {
     "id": "new-stone-slug",
     "name": "New Stone Name",
     "category": "quartzite",
     "categoryLabel": "Exotic Quartzite",
     "type": "natural",
     "meta": "Exotic Quartzite · Brazil",
     "colors": ["white", "gold"],
     "colorLabel": "White, Gold",
     "finishes": ["polished"],
     "thicknesses": ["2", "3"],
     "thicknessLabel": "2 cm · 3 cm",
     "origin": "Brazil",
     "application": "Kitchen island waterfall, master bath",
     "description": "Luminous crystalline stone with warm golden ribbons.",
     "featured": false,
     "image": "assets/images/products/new-stone-slug.jpg",
     "inStock": true
   }
   ```
4. Run standard QA verification to ensure proper filtering.
