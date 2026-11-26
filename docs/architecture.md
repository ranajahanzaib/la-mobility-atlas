# System Architecture

LA Mobility Atlas is engineered using an **offline-first, precomputed analytical cube architecture**.

```
    Dryad / Zenodo Source Datasets (trajectories.parquet, trajectory_meta.parquet)
                                  │
                                  ▼
                    Python Ingestion & Validation
              (Strict schema checks, bounding box quarantine)
                                  │
                                  ▼
                 Polars + DuckDB Analytical Pipeline
          (H3 Spatial Binning, America/Los_Angeles Timezones)
                                  │
                                  ▼
                      Precomputed Release Cubes
              (H3 Cells, OD Flows, Circadian Heatmaps)
                                  │
                                  ▼
              Immutable Cloudflare R2 / Static Artifacts
                                  │
                                  ▼
               Rust / Axum Cloudflare Worker API
                                  │
                                  ▼
          Next.js App Router + MapLibre GL JS + deck.gl
```

## Architectural Principles

1. **Precomputation Over Live Aggregation**:
   Worker requests must never scan millions of coordinate records at runtime. All heavy spatial and statistical calculations occur during pipeline publication.
2. **Deterministic Reproducibility**:
   Given identical source records, the analytical cubes and playback chunks produce bitwise reproducible results.
3. **Decoupled Delivery**:
   The frontend is compiled to a static export served via Cloudflare Workers Static Assets, allowing instant edge delivery without cold starts.
