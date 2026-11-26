"""
Verified geographic exploration regions across the Los Angeles metropolitan study area.
Each region contains verified centroid coordinates, bounding box, and exploration boundary.
"""

from typing import Dict, Any, List

LA_REGIONS: Dict[str, Dict[str, Any]] = {
    "downtown-la": {
        "region_id": "downtown-la",
        "name": "Downtown Los Angeles",
        "description": "Central business, cultural, and historic commercial core of metropolitan Los Angeles.",
        "boundary_type": "polygon",
        "center": [-118.2518, 34.0488],
        "bounding_box": {
            "north": 34.0680,
            "south": 34.0300,
            "west": -118.2750,
            "east": -118.2300,
        },
        "polygon": [
            [-118.2750, 34.0300],
            [-118.2300, 34.0300],
            [-118.2300, 34.0680],
            [-118.2750, 34.0680],
            [-118.2750, 34.0300],
        ],
    },
    "hollywood": {
        "region_id": "hollywood",
        "name": "Hollywood",
        "description": "Entertainment hub, tourist corridor, and major east-west transit arterial connecting to Central LA.",
        "boundary_type": "polygon",
        "center": [-118.3287, 34.1016],
        "bounding_box": {
            "north": 34.1200,
            "south": 34.0850,
            "west": -118.3600,
            "east": -118.3000,
        },
        "polygon": [
            [-118.3600, 34.0850],
            [-118.3000, 34.0850],
            [-118.3000, 34.1200],
            [-118.3600, 34.1200],
            [-118.3600, 34.0850],
        ],
    },
    "koreatown": {
        "region_id": "koreatown",
        "name": "Koreatown",
        "description": "High-density residential and commercial mixed-use urban district along Wilshire Boulevard.",
        "boundary_type": "polygon",
        "center": [-118.3000, 34.0600],
        "bounding_box": {
            "north": 34.0750,
            "south": 34.0450,
            "west": -118.3250,
            "east": -118.2800,
        },
        "polygon": [
            [-118.3250, 34.0450],
            [-118.2800, 34.0450],
            [-118.2800, 34.0750],
            [-118.3250, 34.0750],
            [-118.3250, 34.0450],
        ],
    },
    "westwood": {
        "region_id": "westwood",
        "name": "Westwood & UCLA",
        "description": "Major Westside educational and medical campus hub centered on Westwood Village and UCLA.",
        "boundary_type": "polygon",
        "center": [-118.4452, 34.0689],
        "bounding_box": {
            "north": 34.0850,
            "south": 34.0500,
            "west": -118.4650,
            "east": -118.4250,
        },
        "polygon": [
            [-118.4650, 34.0500],
            [-118.4250, 34.0500],
            [-118.4250, 34.0850],
            [-118.4650, 34.0850],
            [-118.4650, 34.0500],
        ],
    },
    "santa-monica": {
        "region_id": "santa-monica",
        "name": "Santa Monica",
        "description": "Coastal employment center, tech hub, and major beachside destination at the western terminus of I-10.",
        "boundary_type": "polygon",
        "center": [-118.4912, 34.0195],
        "bounding_box": {
            "north": 34.0450,
            "south": 33.9950,
            "west": -118.5200,
            "east": -118.4600,
        },
        "polygon": [
            [-118.5200, 33.9950],
            [-118.4600, 33.9950],
            [-118.4600, 34.0450],
            [-118.5200, 34.0450],
            [-118.5200, 33.9950],
        ],
    },
    "culver-city": {
        "region_id": "culver-city",
        "name": "Culver City",
        "description": "Westside creative media, studio production, and multimodal transit transfer nexus.",
        "boundary_type": "polygon",
        "center": [-118.3965, 34.0211],
        "bounding_box": {
            "north": 34.0400,
            "south": 34.0000,
            "west": -118.4250,
            "east": -118.3700,
        },
        "polygon": [
            [-118.4250, 34.0000],
            [-118.3700, 34.0000],
            [-118.3700, 34.0400],
            [-118.4250, 34.0400],
            [-118.4250, 34.0000],
        ],
    },
    "venice": {
        "region_id": "venice",
        "name": "Venice",
        "description": "Dense coastal neighborhood featuring vibrant cultural activity, beachfront boardwalk, and Silicon Beach offices.",
        "boundary_type": "polygon",
        "center": [-118.4695, 33.9850],
        "bounding_box": {
            "north": 34.0050,
            "south": 33.9700,
            "west": -118.4900,
            "east": -118.4450,
        },
        "polygon": [
            [-118.4900, 33.9700],
            [-118.4450, 33.9700],
            [-118.4450, 34.0050],
            [-118.4900, 34.0050],
            [-118.4900, 33.9700],
        ],
    },
    "lax": {
        "region_id": "lax",
        "name": "LAX Airport Corridor",
        "description": "Los Angeles International Airport terminal complex and surrounding hotel and logistics corridors.",
        "boundary_type": "polygon",
        "center": [-118.4085, 33.9416],
        "bounding_box": {
            "north": 33.9600,
            "south": 33.9250,
            "west": -118.4400,
            "east": -118.3800,
        },
        "polygon": [
            [-118.4400, 33.9250],
            [-118.3800, 33.9250],
            [-118.3800, 33.9600],
            [-118.4400, 33.9600],
            [-118.4400, 33.9250],
        ],
    },
    "south-la": {
        "region_id": "south-la",
        "name": "South Los Angeles",
        "description": "Expansive residential and mixed corridor south of I-10, connecting Downtown LA to the Harbor area.",
        "boundary_type": "polygon",
        "center": [-118.2800, 33.9900],
        "bounding_box": {
            "north": 34.0200,
            "south": 33.9500,
            "west": -118.3100,
            "east": -118.2500,
        },
        "polygon": [
            [-118.3100, 33.9500],
            [-118.2500, 33.9500],
            [-118.2500, 34.0200],
            [-118.3100, 34.0200],
            [-118.3100, 33.9500],
        ],
    },
}


def point_in_region(lng: float, lat: float, region: Dict[str, Any]) -> bool:
    """Check if point is inside region bounding box."""
    bbox = region["bounding_box"]
    return (
        bbox["south"] <= lat <= bbox["north"]
        and bbox["west"] <= lng <= bbox["east"]
    )


def find_region_for_point(lng: float, lat: float) -> str:
    """Identify which predefined exploration region contains (lng, lat), if any."""
    for reg_id, reg in LA_REGIONS.items():
        if point_in_region(lng, lat, reg):
            return reg_id
    return "other-metropolitan"
