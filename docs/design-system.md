# Design System and Visual Tokens

This document details the visual design philosophy, color palettes, typographic scales, and UI tokens powering the LA Mobility Atlas.

---

## 1. Aesthetic Philosophy: High-End Geospatial Observatory

The visual design is inspired by modern scientific visualization platforms, Kepler.gl, CARTO, and aerospace telemetry interfaces:
- **Dark Mode First**: Maps and GPU overlays achieve maximum optical contrast on deep slate and obsidian backgrounds (`#0B0F17`).
- **Precision Typography**: JetBrains Mono for coordinates, metrics, and numerical data; Inter for readable navigation and labels.
- **Translucent Glass Surfaces**: Paneling uses subtle borders (`rgba(255, 255, 255, 0.08)`) and backdrop blur (`backdrop-blur-md`) to maintain spatial map context.

---

## 2. Color Palettes

### 2.1 Geospatial Choropleths
- **Density / Activity Heatmap**: Plasma & Viridis inspired ramp
  - Lowest: `#313695` (Deep Blue)
  - Mid-Low: `#4575b4`
  - Mid: `#fee090`
  - Mid-High: `#f46d43`
  - Highest: `#d73027` (Vivid Crimson)
- **Net Flow Imbalance**: Diverging Blue-to-Red
  - Net Absorption (Destinations): `#00E5FF` (Electric Cyan)
  - Neutral / Balanced: `#64748B` (Slate)
  - Net Generation (Origins): `#FF3366` (Neon Magenta / Rose)

### 2.2 Vector Arcs and Trajectories
- **Trips Playback Trails**: `#00F0FF` (Cyan Glow with alpha falloff).
- **Origin-Destination Arcs**:
  - Source Vertex: `#00E5FF`
  - Target Vertex: `#FF0055`
  - Interpolated Geodesic Gradient across arc curve.

---

## 3. Design Tokens Package (`@la-mobility/design-tokens`)

All visual tokens are defined in TypeScript with strict compile-time types:
- `tokens.colors`: Primary, accent, neutral, status, and choropleth palettes.
- `tokens.spacing`: Consistent spatial rhythm ($4\text{px}$ base grid).
- `tokens.typography`: Font stacks, weights, sizes, and line-height scales.
- `tokens.shadows` and `tokens.radii`: Controlled elevation and curvature.
