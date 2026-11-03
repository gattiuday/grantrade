# Gran Trade Inc. — Product Intent & Context (`PRODUCT.md`)

## 1. Product Identity & Purpose
- **Brand**: Gran Trade Inc.
- **Tagline**: *"The slab is the statement."*
- **Location**: 178 Commerce Road, Carlstadt, New Jersey 07072 · (201) 438-1888
- **Core Business**: Wholesale importer and direct distributor of natural and engineered stone slabs, tiles, and civic monuments, serving fabricators, designers, architects, and builders throughout the New York / New Jersey tri-state area since 2003.

## 2. Target Audience & Personas
1. **Stone Fabricators**: The core customer. They need exact Lot numbers, GT inventory codes, calibrated thicknesses (2 cm vs. 3 cm), slab dimensions (e.g. 128" × 76"), and bundle hold capabilities.
2. **Architects & Interior Designers**: Selecting showpiece stones (Taj Mahal quartzite, Calacatta marble, backlit crystalline quartz). They need visual fidelity, macro texture zoom, bookmatching viability, and architectural application data.
3. **General Contractors & Builders**: Need stock availability, turnaround time, delivery logistics, and commercial-grade durability specifications.
4. **Homeowners (Trade-Accompanied)**: Visiting the Carlstadt yard with their fabricator to tag their exact physical slab.

## 3. Strict Wholesale Business Rules
- **No Generic Retail Quote Spams**: Wholesale distribution does not sell retail counters with arbitrary "Instant Quote" forms.
- **Authentic Wholesale Actions**:
  - *"Come Walk the Yard"*
  - *"Hold a Bundle / Check Slab Availability"*
  - *"Inspect Consecutive Sequences / Bookmatched Pairs"*
  - *"Direct Call to Yard: (201) 438-1888"*
- **Timezone-Aware Operations**: Warehouse hours run on `America/New_York` time. The interface must always indicate live open/closed yard status accurately.

## 4. Key Functional Features
- **Comprehensive 50-Stone Live Inventory**: Filterable by Stone Family, Type (Natural vs. Engineered), Color, Finish (Polished, Honed, Leathered), Thickness (2cm, 3cm), GT#, and Lot#.
- **Dedicated Slab Inspector (`slab.html`)**: Multi-angle visual inspection (full slab view, 2.3x macro zoom, room installation view).
- **Client-Side Saved Slabs Drawer**: Persistent client-side favorites (`localStorage`) so trade pros can tag slabs while walking the yard or browsing the site.
