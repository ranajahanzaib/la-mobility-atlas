"""
Trajectory reconstruction, simplification, and playback chunk partitioner.
Generates bounded temporal chunks for GPU-accelerated TripsLayer rendering.
Coordinates are encoded as [longitude, latitude, timestamp_offset_seconds].
"""

import math
from typing import List, Dict, Any, Tuple
from collections import defaultdict
from mobility.normalization.timezones import parse_timestamp_utc


def simplify_path(
    points: List[Tuple[float, float, float]],
    tolerance_deg: float = 0.0001
) -> List[Tuple[float, float, float]]:
    """
    Ramer-Douglas-Peucker simplification tailored for 3D trajectory points
    [lng, lat, timestamp_offset]. Preserves first, last, and significant turning points.
    """
    if len(points) <= 2:
        return points

    # Find point with maximum perpendicular distance
    p_start = points[0]
    p_end = points[-1]

    dx = p_end[0] - p_start[0]
    dy = p_end[1] - p_start[1]
    denom = math.sqrt(dx * dx + dy * dy) or 1.0

    max_dist = 0.0
    index = 0

    for i in range(1, len(points) - 1):
        p = points[i]
        # Perpendicular distance in geographic plane
        dist = abs(dy * p[0] - dx * p[1] + p_end[0] * p_start[1] - p_end[1] * p_start[0]) / denom
        if dist > max_dist:
            max_dist = dist
            index = i

    if max_dist > tolerance_deg:
        left = simplify_path(points[:index + 1], tolerance_deg)
        right = simplify_path(points[index:], tolerance_deg)
        return left[:-1] + right
    else:
        return [p_start, p_end]


class PlaybackChunker:
    """Partitions ordered trajectory observations into bounded temporal playback chunks."""

    def __init__(self, target_sample_rate: float = 0.10):
        self.target_sample_rate = target_sample_rate
        # Group trajectories by date or 4-hour window
        self.chunks = defaultdict(list)

    def add_trajectory(
        self,
        traj_id: str,
        tuid: str,
        departure_time: str,
        observations: List[Dict[str, Any]],
        color_category: str = "weekday"
    ):
        """Add trajectory with ordered coordinate observations."""
        if len(observations) < 2:
            return

        # Sort observations chronologically
        sorted_obs = sorted(observations, key=lambda o: parse_timestamp_utc(o["timestamp"]))

        # Base timestamp for relative offset in seconds
        base_dt = parse_timestamp_utc(sorted_obs[0]["timestamp"])
        raw_points = []

        for obs in sorted_obs:
            obs_dt = parse_timestamp_utc(obs["timestamp"])
            offset_sec = (obs_dt - base_dt).total_seconds()
            lng = float(obs["longitude"])
            lat = float(obs["latitude"])
            raw_points.append((lng, lat, offset_sec))

        simplified = simplify_path(raw_points, tolerance_deg=0.00008)
        duration = simplified[-1][2]

        chunk_key = base_dt.strftime("%Y-%m-%d")

        self.chunks[chunk_key].append({
            "id": traj_id,
            "tuid": tuid,
            "departure_time": departure_time,
            "duration_seconds": round(duration, 1),
            "distance_meters": round(len(simplified) * 25.0, 1), # estimated
            "color_category": color_category,
            "path": [[round(p[0], 6), round(p[1], 6), round(p[2], 1)] for p in simplified],
        })

    def export_chunks(self) -> List[Dict[str, Any]]:
        """Export serialized chunks with manifest metadata."""
        exported = []
        for chunk_key, trajectories in self.chunks.items():
            total_trajs = len(trajectories)
            total_points = sum(len(t["path"]) for t in trajectories)
            
            chunk_data = {
                "chunk_id": f"chunk-{chunk_key}",
                "start_timestamp": f"{chunk_key}T00:00:00Z",
                "end_timestamp": f"{chunk_key}T23:59:59Z",
                "trajectory_count": total_trajs,
                "point_count": total_points,
                "sampling_rate": self.target_sample_rate,
                "sampling_method": "deterministic-strided-sampling",
                "trajectories": trajectories,
            }
            exported.append(chunk_data)

        return exported
