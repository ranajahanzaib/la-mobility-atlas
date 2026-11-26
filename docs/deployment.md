# Deployment and Infrastructure Architecture

This document describes the production hosting, serverless infrastructure, and asset delivery architecture for LA Mobility Atlas on Cloudflare.

---

## 1. Zero-Egress Serverless Architecture

The entire platform operates on an edge-native, zero-server architecture leveraging Cloudflare:

```
                            User Client (Browser)
                                      │
                      ┌───────────────┴───────────────┐
                      ▼                               ▼
         Static Web App Assets                 API & Data Queries
         (Next.js Exported HTML/JS)            (/api/v1/*, /data/*)
                      │                               │
                      ▼                               ▼
       Cloudflare Workers Static Assets       Cloudflare Rust Worker (WASM)
                      │                               │
                      │                       ┌───────┴───────┐
                      │                       ▼               ▼
                      │                 Worker Memory   Cloudflare R2 Bucket
                      │                 (Fast Cache)    (Parquet & PMTiles)
                      │                       │               │
                      └───────────────┬───────┘───────────────┘
                                      ▼
                           Cloudflare Global Edge
```

---

## 2. Infrastructure Components

### 2.1 Cloudflare Workers Static Assets
The Next.js frontend is configured with `output: 'export'`, generating a completely static bundle (`apps/web/out/`).
Cloudflare Workers Static Assets serves these files directly from edge points-of-presence (PoPs) worldwide with sub-20ms Time To First Byte (TTFB).

### 2.2 Cloudflare Rust Worker (`wasm32-unknown-unknown`)
The API router (`services/api/`) compiles to WebAssembly via `cargo build --target wasm32-unknown-unknown --release`.
It exposes standard Axum routing logic via the Cloudflare Workers runtime, executing queries with near-instant cold starts (<5ms).

### 2.3 Cloudflare R2 Object Storage
High-resolution GeoParquet partitions, PMTiles vector tile archives, and compressed trajectory playback chunks reside in an R2 bucket (`la-mobility-atlas-data`).
R2 charges zero egress fees, enabling high-bandwidth geospatial data transfer at low cost.

---

## 3. Configuration Files

### `wrangler.toml` (Cloudflare Configuration)
```toml
name = "la-mobility-atlas"
main = "services/api/target/wasm32-unknown-unknown/release/la_mobility_api.wasm"
compatibility_date = "2024-04-01"

[assets]
directory = "apps/web/out"
binding = "ASSETS"

[[r2_buckets]]
binding = "DATA_BUCKET"
bucket_name = "la-mobility-atlas-data"
```

---

## 4. Local Development vs. Production Deployment

| Dimension | Local Development | Production Edge |
|---|---|---|
| **Frontend** | `pnpm --filter web dev` (Next.js dev server on 3000) | Cloudflare Static Assets (`apps/web/out`) |
| **Backend API** | `cargo run --bin la_mobility_server` (Native on 8787) | Cloudflare Rust WASM Worker |
| **Data Artifacts** | Local files in `public/data/` | Cloudflare R2 + Edge Cache |
| **Routing** | Next.js API proxy or direct port call | Unified domain routing (`atlas.la/api/*`) |
