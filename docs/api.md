# REST API Specification

The LA Mobility Atlas backend API is powered by a high-performance Rust service running on Axum. It can execute both as a serverless Cloudflare Worker (compiled to `wasm32-unknown-unknown`) and as a standalone native binary (`la_mobility_server`).

---

## Base URLs
- **Production Edge (Cloudflare)**: `https://mobility.atlas.la/api/v1` (or same-origin `/api/v1`)
- **Local Development**: `http://127.0.0.1:8787/api/v1`

---

## 1. System Health & Metadata

### `GET /api/v1/health`
Returns service operational status, target architecture, and release tag.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "engine": "axum-rust",
  "target": "native-or-wasm32",
  "timestamp": "2026-11-26T16:00:00Z"
}
```

### `GET /api/v1/metadata`
Returns global dataset bounding box, temporal coverage, total counts, and checksums.

**Response `200 OK`**:
```json
{
  "release_id": "rel-2019-12-v1",
  "dataset_name": "Synthetic vehicle trajectory dataset for metropolitan Los Angeles (DDTG)",
  "temporal_coverage": {
    "start": "2019-12-01T00:00:00Z",
    "end": "2019-12-14T23:59:59Z",
    "timezone": "America/Los_Angeles"
  },
  "bounding_box": {
    "north": 34.335035,
    "south": 33.699820,
    "west": -118.667665,
    "east": -118.180532
  },
  "counts": {
    "total_trajectories": 2500,
    "total_observations": 76144,
    "h3_cells_res7": 58,
    "od_flows": 120
  }
}
```

---

## 2. Spatial Endpoints

### `GET /api/v1/cells`
Returns precomputed H3 cells and activity metrics.

**Query Parameters**:
- `resolution` (integer, optional, default: `7`): `6`, `7`, or `8`.
- `metric` (string, optional): Filter or sort by `volume`, `origins`, `destinations`, `net_imbalance`.

**Response `200 OK`**:
```json
{
  "resolution": 7,
  "count": 58,
  "cells": [
    {
      "cell_id": "872830828ffffff",
      "resolution": 7,
      "centroid": [34.0522, -118.2437],
      "boundary": [[-118.2437, 34.0522], ...],
      "metrics": {
        "origins": 1420,
        "destinations": 1380,
        "total_volume": 2800,
        "net_imbalance": 40
      }
    }
  ]
}
```

### `GET /api/v1/cells/:id`
Returns detailed analytical breakdown for a specific H3 cell.

---

## 3. Mobility Flows & OD Matrix

### `GET /api/v1/flows`
Returns top origin-destination flow corridors.

**Query Parameters**:
- `min_volume` (integer, optional, default: `1`): Minimum trip threshold.
- `limit` (integer, optional, default: `50`): Maximum results.

**Response `200 OK`**:
```json
{
  "total_flows": 120,
  "flows": [
    {
      "flow_id": "flow-872830828ffffff-87283082bffffff",
      "origin_cell": "872830828ffffff",
      "dest_cell": "87283082bffffff",
      "volume": 342,
      "avg_duration_minutes": 24.5,
      "avg_distance_km": 12.8,
      "origin_centroid": [34.0522, -118.2437],
      "dest_centroid": [34.0928, -118.3287]
    }
  ]
}
```

### `GET /api/v1/od-matrix`
Returns the aggregated $N \times N$ origin-destination transition matrix across key regions.

---

## 4. Temporal Profiles

### `GET /api/v1/temporal/hourly`
Returns the 24-hour diurnal profile broken down by weekday and weekend.

**Response `200 OK`**:
```json
{
  "hours": [
    {
      "hour": 0,
      "weekday_trips": 420,
      "weekend_trips": 650,
      "total_trips": 1070
    },
    ...
  ]
}
```

### `GET /api/v1/temporal/matrix`
Returns the $7 \times 24$ day-hour activity matrix.

---

## 5. Statistical Distributions

### `GET /api/v1/distributions`
Returns histogram bins and parametric percentiles for trip duration, travel distance, and speed.

---

## 6. Region Summaries

### `GET /api/v1/regions`
Returns aggregate statistics for Los Angeles administrative and functional regions (Downtown, Hollywood, Santa Monica, LAX, etc.).
