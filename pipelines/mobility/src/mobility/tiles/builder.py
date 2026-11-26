"""
Spatial tile and GeoJSON builder for H3 activity surfaces and region boundaries.
Exports clean GeoJSON FeatureCollections for map rendering.
"""

from typing import List, Dict, Any
from mobility.spatial.regions import LA_REGIONS
from mobility.spatial.h3_grid import cell_to_boundary


def build_h3_cells_geojson(cells: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Convert H3 cell activity records into GeoJSON FeatureCollection."""
    features = []
    for cell in cells:
        boundary = cell.get("boundary") or cell_to_boundary(cell["cell_id"])
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [boundary],
            },
            "properties": {
                "cell_id": cell["cell_id"],
                "origin_count": cell["origin_count"],
                "destination_count": cell["destination_count"],
                "distinct_trajectories": cell["distinct_trajectories"],
                "observation_count": cell["observation_count"],
                "median_duration": cell["median_duration"],
                "median_distance": cell["median_distance"],
            },
        })

    return {
        "type": "FeatureCollection",
        "features": features,
    }


def build_regions_geojson() -> Dict[str, Any]:
    """Convert predefined LA exploration regions into GeoJSON FeatureCollection."""
    features = []
    for reg_id, reg in LA_REGIONS.items():
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [reg["polygon"]],
            },
            "properties": {
                "region_id": reg["region_id"],
                "name": reg["name"],
                "description": reg["description"],
                "center": reg["center"],
            },
        })

    return {
        "type": "FeatureCollection",
        "features": features,
    }
