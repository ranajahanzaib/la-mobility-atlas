# AGENTS.md — LA Mobility Atlas Engineering & Research Guidelines

This document outlines the architectural boundaries, engineering conventions, testing protocols, and scientific constraints governing **LA Mobility Atlas**.

---

## 1. Scientific & Ethical Boundaries

1. **Synthetic Data Integrity**:
   - The primary research dataset represents _synthetically generated vehicle trajectories_ using the DDTG simulation model (Anastasiou, Kim, & Shahabi, 2022).
   - Under no circumstances should user-facing copy or analytical narratives suggest that these are live GPS recordings, real-world license plate scans, official toll plaza transactions, or verified personal travel diaries.
   - Do not infer, estimate, or extrapolate demographic, socioeconomic, income, household, or residential characteristics from trajectory endpoints.

2. **Geographic Coverage & Bounds**:
   - Study bounding box:
     - North: `34.335035° N`
     - South: `33.699820° N`
     - West: `-118.667665° W`
     - East: `-118.180532° W`
   - Bounded within metropolitan Los Angeles. Do not imply coverage of Orange County, San Bernardino, Ventura, or Riverside beyond the strict study bounding box.

3. **Responsible Metric Interpretations**:
   - Distinct counts: Unique vehicles within a cell cannot be simply summed across cells to derive a metropolitan total.
   - Medians & Percentiles: Global medians cannot be calculated by averaging cell medians. Use precomputed histogram distributions.
   - Imbalance: Directional flow differences indicate synthetic model distribution properties across the selected interval, not physical employment or residential zoning proof.

---

## 2. Monorepo Architecture & Responsibilities

- `apps/web`: Next.js App Router (React 19, TypeScript strict mode, MapLibre GL, deck.gl, Tailwind CSS, Zustand, TanStack Query).
  - Must remain static-export compatible (`output: 'export'`).
  - No server-side Node.js runtime dependencies allowed in production.
- `services/api`: Rust / Axum Cloudflare Worker API.
  - Compiles to `wasm32-unknown-unknown` for Cloudflare Workers.
  - Compiles to native binary (`la_mobility_server`) for local development on port 8787.
  - Zero-copy Serde deserialization and strict request query validation.
- `pipelines/mobility`: Python data engineering pipeline.
  - Ingestion, validation, coordinate normalization, timezone conversion (`America/Los_Angeles`), H3 hexagonal aggregation, and trajectory chunk partitioning.
- `packages/contracts`: Single source of truth for analytical schemas and TypeScript types.
- `packages/design-tokens`: Color palettes, themes (Dark and Light), typography, and camera presets.
- `packages/visualization`: Shared deck.gl formatting and D3 scale utilities.

---

## 3. Local Development Conventions

```bash
# Install workspace dependencies
pnpm install

# Run frontend in development mode
pnpm dev

# Run data pipeline to publish analytical artifacts
pnpm data:publish

# Run Rust API server locally
cargo run --bin la_mobility_server --manifest-path services/api/Cargo.toml
```

---

## 4. Testing Protocols

1. **Python Pipeline**:
   - `python3 -m unittest discover -s pipelines/mobility/tests -p "test_*.py"`
   - Verifies schema validation, coordinate bounds, H3 index roundtrips, timezone arithmetic, and distribution calculations.
2. **Rust API**:
   - `cargo test --tests --manifest-path services/api/Cargo.toml`
   - Verifies all 6 core HTTP endpoints, request routing, status codes, and JSON serialization.
3. **Frontend**:
   - `pnpm --filter @la-mobility-atlas/web build`
   - Verifies TypeScript strict typechecking and 100% static page prerendering across all 12 routes.
