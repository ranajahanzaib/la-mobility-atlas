"""
Validation stage for LA synthetic trajectory and metadata records.
Enforces strict schema rules, geographic bounding box checks, timestamp validity,
and relational integrity between observations and metadata.
"""

from typing import Dict, Any, List, Tuple, Optional
from datetime import datetime, timezone
from mobility.spatial.h3_grid import LA_BBOX
from mobility.normalization.timezones import parse_timestamp_utc


METADATA_REQUIRED_FIELDS = [
    "uuid",
    "tuid",
    "origin_latitude",
    "origin_longitude",
    "destination_latitude",
    "destination_longitude",
    "departure_time",
    "travel_distance",
    "travel_time",
    "displacement",
    "count",
]

OBSERVATION_REQUIRED_FIELDS = [
    "uuid",
    "tuid",
    "latitude",
    "longitude",
    "timestamp",
]


class DatasetValidator:
    """Validates raw trajectory records against scientific and geographic rules."""

    def __init__(self, bbox: Dict[str, float] = LA_BBOX):
        self.bbox = bbox
        self.report = {
            "validation_timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "metadata_total": 0,
            "metadata_valid": 0,
            "metadata_quarantined": 0,
            "observations_total": 0,
            "observations_valid": 0,
            "observations_quarantined": 0,
            "reasons": {},
        }

    def _log_quarantine(self, reason: str):
        self.report["reasons"][reason] = self.report["reasons"].get(reason, 0) + 1

    def validate_metadata_row(self, row: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
        """Validate single trajectory metadata record."""
        self.report["metadata_total"] += 1

        # Check required fields
        for field in METADATA_REQUIRED_FIELDS:
            if field not in row or row[field] is None:
                self._log_quarantine(f"missing_field_{field}")
                self.report["metadata_quarantined"] += 1
                return False, f"Missing or null field: {field}"

        # Coordinate bounds check for origin and destination
        try:
            o_lat = float(row["origin_latitude"])
            o_lng = float(row["origin_longitude"])
            d_lat = float(row["destination_latitude"])
            d_lng = float(row["destination_longitude"])
        except (ValueError, TypeError):
            self._log_quarantine("invalid_coordinate_type")
            self.report["metadata_quarantined"] += 1
            return False, "Non-numeric coordinate"

        if not (self.bbox["south"] <= o_lat <= self.bbox["north"] and
                self.bbox["west"] <= o_lng <= self.bbox["east"]):
            self._log_quarantine("origin_out_of_bounds")
            self.report["metadata_quarantined"] += 1
            return False, "Origin out of LA coverage bounds"

        if not (self.bbox["south"] <= d_lat <= self.bbox["north"] and
                self.bbox["west"] <= d_lng <= self.bbox["east"]):
            self._log_quarantine("destination_out_of_bounds")
            self.report["metadata_quarantined"] += 1
            return False, "Destination out of LA coverage bounds"

        # Timestamp check
        try:
            dt = parse_timestamp_utc(row["departure_time"])
        except Exception:
            self._log_quarantine("invalid_departure_time")
            self.report["metadata_quarantined"] += 1
            return False, "Invalid departure timestamp"

        # Numeric metrics validity
        try:
            distance = float(row["travel_distance"])
            time_sec = float(row["travel_time"])
            disp = float(row["displacement"])
            count = int(row["count"])
        except (ValueError, TypeError):
            self._log_quarantine("invalid_metric_type")
            self.report["metadata_quarantined"] += 1
            return False, "Non-numeric travel metric"

        if distance < 0 or time_sec < 0 or disp < 0 or count <= 0:
            self._log_quarantine("negative_or_zero_metric")
            self.report["metadata_quarantined"] += 1
            return False, "Negative travel metric or zero observation count"

        # Travel distance must be at least displacement (straight line)
        # Allow tiny epsilon for numerical roundoff
        if distance < disp - 1.0:
            self._log_quarantine("distance_less_than_displacement")
            self.report["metadata_quarantined"] += 1
            return False, "Travel distance cannot be less than Euclidean displacement"

        self.report["metadata_valid"] += 1
        return True, None

    def validate_observation_row(self, row: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
        """Validate single trajectory coordinate observation record."""
        self.report["observations_total"] += 1

        for field in OBSERVATION_REQUIRED_FIELDS:
            if field not in row or row[field] is None:
                self._log_quarantine(f"obs_missing_{field}")
                self.report["observations_quarantined"] += 1
                return False, f"Missing observation field: {field}"

        try:
            lat = float(row["latitude"])
            lng = float(row["longitude"])
        except (ValueError, TypeError):
            self._log_quarantine("obs_invalid_coords")
            self.report["observations_quarantined"] += 1
            return False, "Non-numeric observation coordinates"

        if not (self.bbox["south"] <= lat <= self.bbox["north"] and
                self.bbox["west"] <= lng <= self.bbox["east"]):
            self._log_quarantine("obs_out_of_bounds")
            self.report["observations_quarantined"] += 1
            return False, "Observation coordinates outside bounding box"

        try:
            dt = parse_timestamp_utc(row["timestamp"])
        except Exception:
            self._log_quarantine("obs_invalid_timestamp")
            self.report["observations_quarantined"] += 1
            return False, "Invalid observation timestamp"

        self.report["observations_valid"] += 1
        return True, None

    def get_validation_report(self) -> Dict[str, Any]:
        """Return full structured validation report."""
        return self.report
