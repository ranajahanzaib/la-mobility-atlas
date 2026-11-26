# Vector Tiles and Geospatial Caching

This document outlines the vector tiling architecture, PMTiles integration, and geospatial caching strategies for metropolitan Los Angeles datasets.

---

## 1. Vector Tile Architecture

For dense spatial representations (such as Resolution 8 H3 cells and high-volume OD flow corridors), static GeoJSON structures become bandwidth-intensive. 
The platform adopts an indexed vector tiling strategy:

```
Source GeoParquet / DuckDB
           │
           ▼
Tippecanoe / Tile Generation
           │
           ▼
PMTiles Single-File Archive
           │
           ▼
Cloudflare R2 Bucket
           │
           ▼
HTTP Byte-Range Requests (PMTiles Reader in MapLibre GL)
```

---

## 2. PMTiles Integration

**PMTiles** is an open cloud-native format for vector tiles stored as a single object archive:
1. **Zero Server Process**: Eliminates the need for running tile servers (e.g., TileServer GL, Martin).
2. **Byte-Range Seeking**: Uses HTTP `Range` headers to read tile headers and leaf directories with 1–2 requests.
3. **Direct MapLibre Integration**: The `pmtiles` JavaScript client plugs directly into MapLibre GL JS protocol handlers:

```typescript
import { Protocol } from 'pmtiles';
import maplibregl from 'maplibre-gl';

const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);
```

---

## 3. Tile Layer Configuration

| Tile Layer | Source Geometry | Zoom Levels | Attributes Encoded |
|---|---|---|---|
| `la_h3_cells` | Hexagonal Polygons (Res 6–8) | z9 – z16 | `cell_id`, `volume`, `origins`, `destinations`, `net_imbalance` |
| `la_od_corridors` | Directed Great-Circle LineStrings | z8 – z14 | `flow_id`, `origin_cell`, `dest_cell`, `volume`, `avg_duration` |
| `la_regions` | Administrative Municipal Polygons | z7 – z12 | `region_id`, `region_name`, `total_trips` |

---

## 4. Edge Caching Strategy

Vector tiles and analytical JSON releases are cached aggressively on Cloudflare's global edge network:
- **Immutable Releases**: Assets under `/data/releases/rel-*` receive `Cache-Control: public, max-age=31536000, immutable`.
- **Worker Edge Cache**: The Rust Worker enforces Cloudflare Cache API lookups prior to querying R2 object storage.
- **Client Cache**: TanStack Query caches parsed geojson and analytical summaries in memory for the duration of the exploration session.
