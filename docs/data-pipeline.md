# Data Pipeline Specification

The data pipeline in `pipelines/mobility/` executes four sequential phases:

## 1. Ingestion & Discovery (`mobility.ingestion`)
- Checks for local raw source files (`data/raw/trajectories.parquet`, `data/raw/trajectory_meta.parquet`).
- Verifies SHA-256 checksums when remote sources are downloaded.
- When remote sources are unavailable, generates a deterministic research fixture in `data/fixtures/` with identical schemas and geographic parameters.

## 2. Validation (`mobility.validation`)
- Rejects or quarantines rows violating schema rules:
  - Latitude or Longitude outside documented LA bounding box.
  - Non-numeric or missing required columns.
  - Departure timestamp unparseable.
  - Travel distance less than Euclidean displacement minus numerical epsilon.
- Emits structured machine-readable validation reports in `overview.json`.

## 3. Normalization (`mobility.normalization`)
- Converts UTC timestamps to `America/Los_Angeles` local time using `zoneinfo`.
- Extracts local hour (0–23), day of week (0–6), and day classification (`weekday` vs. `weekend`).
- Assigns H3 spatial indexes at resolutions 6, 7, and 8.

## 4. Aggregation & Artifact Generation (`mobility.aggregation`, `mobility.publishing`)
- Aggregates H3 cell activity metrics.
- Computes origin-destination flow matrices.
- Partitions chronological trajectory observations into 24-hour playback chunks.
- Computes parametric (mean, std dev) and non-parametric (P10..P99) distribution statistics.
