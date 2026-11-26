"""
H3 spatial indexing and grid calculations for Los Angeles Metropolitan Area.
Supports both native h3-py library (if installed) and a built-in deterministic
hexagonal grid engine with identical interface.
"""

import math
from typing import List, Tuple, Dict, Any, Optional

try:
    import h3
    HAS_H3_LIB = True
except ImportError:
    h3 = None
    HAS_H3_LIB = False

# LA metropolitan bounding box
LA_BBOX = {
    "north": 34.335035,
    "south": 33.699820,
    "west": -118.667665,
    "east": -118.180532,
}

# Standard H3 average cell areas in km2 by resolution
H3_AREA_KM2 = {
    6: 36.0,
    7: 5.16,
    8: 0.737,
    9: 0.105,
}

# Resolution scale factors in approximate degrees
RES_DEG_SPACING = {
    6: 0.055,
    7: 0.021,
    8: 0.008,
    9: 0.003,
}


def latlng_to_cell(lat: float, lng: float, resolution: int = 7) -> str:
    """Convert latitude/longitude to an H3 cell index string."""
    if HAS_H3_LIB and hasattr(h3, 'latlng_to_cell'):
        return h3.latlng_to_cell(lat, lng, resolution)
    elif HAS_H3_LIB and hasattr(h3, 'geo_to_h3'):
        return h3.geo_to_h3(lat, lng, resolution)
    
    # Deterministic spatial hexagonal binning fallback
    # Hexagonal axial coordinate calculation
    spacing = RES_DEG_SPACING.get(resolution, 0.021)
    
    # Project to approximate local metric plane centered in LA
    lat_origin = 34.0
    lng_origin = -118.4
    
    # Cosine correction for longitude degrees
    cos_lat = math.cos(math.radians(lat_origin))
    x = (lng - lng_origin) * cos_lat / spacing
    y = (lat - lat_origin) / spacing
    
    # Axial hex coords (q, r)
    q = (math.sqrt(3) / 3 * x - 1 / 3 * y)
    r = (2 / 3 * y)
    
    # Cube coordinates rounding
    s = -q - r
    rq = round(q)
    rr = round(r)
    rs = round(s)
    
    q_diff = abs(rq - q)
    r_diff = abs(rr - r)
    s_diff = abs(rs - s)
    
    if q_diff > r_diff and q_diff > s_diff:
        rq = -rr - rs
    elif r_diff > s_diff:
        rr = -rq - rs
    
    # Store rq and rr with bias 8192 into 14 bits each
    rq_enc = (rq + 8192) & 0x3FFF
    rr_enc = (rr + 8192) & 0x3FFF
    raw_val = ((resolution & 0xF) << 28) | (rq_enc << 14) | rr_enc
    
    return f"8{resolution}29a{raw_val:010x}"[:15]


def cell_to_latlng(cell_id: str) -> Tuple[float, float]:
    """Convert H3 cell index to center (latitude, longitude)."""
    if HAS_H3_LIB and hasattr(h3, 'cell_to_latlng'):
        return h3.cell_to_latlng(cell_id)
    elif HAS_H3_LIB and hasattr(h3, 'h3_to_geo'):
        return h3.h3_to_geo(cell_id)
    
    # Decode deterministic hex
    try:
        res = int(cell_id[1])
        spacing = RES_DEG_SPACING.get(res, 0.021)
        raw_val = int(cell_id[6:], 16)
        
        rq = ((raw_val >> 14) & 0x3FFF) - 8192
        rr = (raw_val & 0x3FFF) - 8192
            
        lat_origin = 34.0
        lng_origin = -118.4
        cos_lat = math.cos(math.radians(lat_origin))
        
        # Invert axial hex coords to (x, y)
        x = (math.sqrt(3) * rq + math.sqrt(3) / 2 * rr) * spacing
        y = (3 / 2 * rr) * spacing
        
        lat = lat_origin + y
        lng = lng_origin + x / cos_lat
        return (lat, lng)
    except Exception:
        return (34.0522, -118.2437) # LA default


def cell_to_boundary(cell_id: str) -> List[Tuple[float, float]]:
    """Return polygon boundary coordinates as list of (lng, lat) tuples."""
    if HAS_H3_LIB and hasattr(h3, 'cell_to_boundary'):
        coords = h3.cell_to_boundary(cell_id)
        # Convert (lat, lng) to (lng, lat) for GeoJSON/MapLibre
        return [(c[1], c[0]) for c in coords]
    elif HAS_H3_LIB and hasattr(h3, 'h3_to_geo_boundary'):
        coords = h3.h3_to_geo_boundary(cell_id)
        return [(c[1], c[0]) for c in coords]
    
    # Fallback hexagonal boundary computation
    lat, lng = cell_to_latlng(cell_id)
    res = int(cell_id[1]) if len(cell_id) > 1 and cell_id[1].isdigit() else 7
    radius = RES_DEG_SPACING.get(res, 0.021) * 0.58
    cos_lat = math.cos(math.radians(lat))
    
    boundary = []
    for i in range(6):
        angle = math.pi / 3 * i + math.pi / 6
        dx = radius * math.cos(angle) / cos_lat
        dy = radius * math.sin(angle)
        boundary.append((round(lng + dx, 6), round(lat + dy, 6)))
    # Close polygon
    boundary.append(boundary[0])
    return boundary


def cell_area(resolution: int) -> float:
    """Return average cell area in square kilometers."""
    return H3_AREA_KM2.get(resolution, 5.16)
