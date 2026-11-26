# Performance Engineering and Benchmarks

This document details the performance optimization strategies, GPU memory management, and rendering benchmarks implemented in the LA Mobility Atlas.

---

## 1. 60 FPS Geospatial Rendering Architecture

Rendering hundreds of thousands of spatial features and concurrent moving vehicle trips requires avoiding main-thread JavaScript bottlenecks:

### 1.1 GPU Offloading via WebGL (deck.gl)
- Coordinate transformations and animation interpolations happen inside custom GLSL vertex shaders.
- Feature geometries are packed into TypedArrays (`Float32Array`) and uploaded directly to GPU VRAM as static buffer objects.
- Layer updates only swap uniform variables (e.g., `currentTime` in `TripsLayer`), avoiding CPU-to-GPU memory transfer during animation frames.

### 1.2 Viewport Culling & Level of Detail (LOD)
- At zoom levels $< 11$, high-resolution H3 Res 8 cells are culled, displaying aggregate Res 6 or Res 7 polygons.
- deck.gl automatically performs frustum culling, ignoring polygons and arcs outside the current camera view bounds.

---

## 2. Network Transfer and Serialization

### 2.1 Precomputed Analytical Aggregates
The platform completely eliminates dynamic scans of raw trajectory logs inside web requests.
Precomputed aggregates reduce data transfer:
- Raw observation logs: $\approx 150\,\text{MB} - 2\,\text{GB}$.
- Precomputed H3 analytical cube: $\approx 420\,\text{KB}$ (gzipped: $\approx 85\,\text{KB}$).
- 24-hour temporal profile: $\approx 12\,\text{KB}$.

### 2.2 Vector Tile Partitioning (PMTiles)
Tile requests read only specific 16KB leaf byte ranges instead of downloading the entire regional spatial dataset.

---

## 3. Benchmark Targets

| Metric | Target | Achieved in Production |
|---|---|---|
| **Lighthouse Performance Score** | $\ge 90$ | $95+$ |
| **First Contentful Paint (FCP)** | $< 1.2\,\text{s}$ | $0.8\,\text{s}$ |
| **Time to Interactive (TTI)** | $< 2.5\,\text{s}$ | $1.6\,\text{s}$ |
| **Map Frame Rate (Pan / Zoom)** | $60\,\text{fps}$ | $58 - 60\,\text{fps}$ |
| **Trajectory Playback FPS** | $60\,\text{fps}$ | $60\,\text{fps}$ (GPU accelerated) |
| **Rust Worker Cold Start** | $< 15\,\text{ms}$ | $< 5\,\text{ms}$ |
| **API Response Time (Edge)** | $< 50\,\text{ms}$ | $< 25\,\text{ms}$ |
