"""
Data normalization pipeline for LA Mobility Atlas.
Transforms raw records into canonical formats with verified coordinates,
UTC timestamps, America/Los_Angeles calendar attributes, and H3 cell indexes.
"""

from typing import Dict, Any, List
from mobility.normalization.timezones import parse_timestamp_utc, extract_temporal_dimensions
from mobility.spatial.h3_grid import latlng_to_cell, cell_to_latlng


def normalize_metadata_record(raw: Dict[str, Any], resolution: int = 7) -> Dict[str, Any]:
    """Normalize single trajectory metadata record."""
    dt_utc = parse_timestamp_utc(raw["departure_time"])
    temp = extract_temporal_dimensions(dt_utc)

    o_lat = round(float(raw["origin_latitude"]), 6)
    o_lng = round(float(raw["origin_longitude"]), 6)
    d_lat = round(float(raw["destination_latitude"]), 6)
    d_lng = round(float(raw["destination_longitude"]), 6)

    dist_m = round(float(raw["travel_distance"]), 1)
    dur_s = round(float(raw["travel_time"]), 1)
    disp_m = round(float(raw["displacement"]), 1)

    o_cell = latlng_to_cell(o_lat, o_lng, resolution)
    d_cell = latlng_to_cell(d_lat, d_lng, resolution)

    return {
        "uuid": str(raw["uuid"]),
        "tuid": str(raw["tuid"]),
        "origin_latitude": o_lat,
        "origin_longitude": o_lng,
        "destination_latitude": d_lat,
        "destination_longitude": d_lng,
        "origin_cell": o_cell,
        "destination_cell": d_cell,
        "departure_time": temp["utc_iso"],
        "departure_local": temp["local_iso"],
        "date_str": temp["date_str"],
        "hour": temp["hour"],
        "day_of_week": temp["day_of_week"],
        "day_type": temp["day_type"],
        "travel_distance": dist_m,
        "travel_time": dur_s,
        "displacement": disp_m,
        "count": int(raw.get("count", 1)),
    }


def normalize_observation_record(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize single coordinate observation record."""
    dt_utc = parse_timestamp_utc(raw["timestamp"])
    return {
        "uuid": str(raw["uuid"]),
        "tuid": str(raw["tuid"]),
        "latitude": round(float(raw["latitude"]), 6),
        "longitude": round(float(raw["longitude"]), 6),
        "accuracy": int(raw.get("accuracy", 0)),
        "timestamp": dt_utc.isoformat(),
    }
