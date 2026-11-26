# Spatial Aggregation and H3 Indexing Architecture

This document describes the spatial partitioning, hexagonal aggregation methodology, and coordinate transformations powering the LA Mobility Atlas.

---

## 1. Spatial Indexing with H3

LA Mobility Atlas uses the Uber H3 discrete global grid system for spatial discretization. Hexagonal cells offer critical analytical advantages over traditional square grids:
1. **Uniform Adjacency**: Each hexagon shares exactly 6 neighbors at identical centroid-to-centroid distances (eliminating the rook vs. queen neighborhood dilemma of rectangular grids).
2. **Minimal Perimeter-to-Area Distortion**: Hexagons minimize edge perimeter relative to internal area, mitigating boundary sampling bias.
3. **Continuous Spatial Tessellation**: Provides isometric sampling across complex metropolitan topographies.

### Resolution Hierarchy

| Resolution | Average Hex Area ($\text{km}^2$) | Average Edge Length ($\text{km}$) | Spatial Purpose in Atlas |
|---|---|---|---|
| **Res 6** | $36.0$ | $3.70$ | Regional macro-corridors (Valley $\leftrightarrow$ Basin $\leftrightarrow$ Westside) |
| **Res 7** | $5.16$ | $1.40$ | Municipal districts (DTLA, Hollywood, Santa Monica) |
| **Res 8** | $0.74$ | $0.53$ | Granular neighborhood activity & arterial intersections |

---

## 2. Los Angeles Coverage Bounding Box

The synthetic DDTG dataset bounding box defines the study universe:
- **North Latitude**: $34.335035^\circ$
- **South Latitude**: $33.699820^\circ$
- **West Longitude**: $-118.667665^\circ$
- **East Longitude**: $-118.180532^\circ$
- **Spatial Extent**: Approximately $45\,\text{km} \times 70\,\text{km}$ ($3,150\,\text{km}^2$).

Coordinates outside this bounding envelope are rejected during initial ingestion validation (`pipelines/mobility/src/mobility/validation/`).

---

## 3. Boundary Polygon and Vertex Generation

Every H3 index uniquely defines six exterior vertices in geodetic coordinates (WGS84). 
For any cell $c$, the vertex ring is computed using spherical trigonometry:

$$R = \text{HexRadius}(r)$$
$$\phi_k = \phi_c + R \sin\left(\frac{k \pi}{3} + \theta\right)$$
$$\lambda_k = \lambda_c + \frac{R}{\cos(\phi_c)} \cos\left(\frac{k \pi}{3} + \theta\right)$$
for $k \in \{0, 1, 2, 3, 4, 5\}$, closed with vertex 0 to form a standard GeoJSON Polygon:
`[[lng0, lat0], [lng1, lat1], ..., [lng5, lat5], [lng0, lat0]]`.

---

## 4. Aggregation Pipeline

```
Raw Coordinates (Lat, Lng)
           │
           ▼
H3 Cell Assignment (Res 6, 7, 8)
           │
     ┌─────┴──────────────────┐
     ▼                        ▼
Origins (First Point)     Destinations (Last Point)
     │                        │
     └───────────┬────────────┘
                 ▼
     Group By (Cell, Hour, DayType)
                 │
                 ▼
     Cell Activity Aggregates
     - total_origins
     - total_destinations
     - total_volume
     - net_flow_imbalance
```

### GeoParquet Output
Aggregates are partitioned by resolution:
- `data/processed/cells_res6.parquet`
- `data/processed/cells_res7.parquet`
- `data/processed/cells_res8.parquet`

Each row contains `cell_id`, `resolution`, `centroid_lat`, `centroid_lng`, `geometry` (GeoArrow WKB / GeoJSON coordinates), and precomputed activity statistics.
