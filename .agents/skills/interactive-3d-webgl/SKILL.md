---
name: interactive-3d-webgl
description: >-
  Interactive 3D and WebGL engineering skill. Covers Three.js, shaders, PBR materials,
  lighting, orbit controls, camera transitions, and resilient 2D fallbacks.
---

# Interactive 3D & WebGL Engineering

## Principles for 3D Product & Material Inspection

1. **Material Realism for Natural Stone**:
   - Use `MeshPhysicalMaterial` or `MeshStandardMaterial` for stone surfaces.
   - Combine high-res diffuse/albedo maps with subtle roughness maps to emulate honed or polished stone sheen.
   - Add ambient occlusion (AO) and environment maps (`PMREMGenerator` / HDR) for authentic ambient lighting.

2. **Camera & Orbit Controls**:
   - Limit vertical polar angle (`minPolarAngle: Math.PI / 4`, `maxPolarAngle: Math.PI / 1.8`) to keep full upright slabs grounded.
   - Smooth damping (`dampingFactor: 0.05`) for silky, tactile dragging.

3. **Resilience & Graceful Degradation**:
   - Detect WebGL support via `WebGLRenderingContext`.
   - If WebGL is unavailable or fails, automatically fallback to responsive picture elements with high-res 2.3x CSS pan/zoom.

