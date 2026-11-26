"""
Analytical aggregation engine for LA Mobility Atlas.
Calculates H3 cell activity, origin-destination relationships, temporal cubes,
percentiles, and distribution metrics with mathematical correctness.
"""

import math
from typing import List, Dict, Any, Tuple
from collections import defaultdict
from mobility.spatial.h3_grid import latlng_to_cell, cell_to_latlng, cell_to_boundary, cell_area
from mobility.spatial.regions import LA_REGIONS, find_region_for_point
from mobility.normalization.timezones import parse_timestamp_utc, extract_temporal_dimensions


def calculate_percentiles(sorted_values: List[float]) -> Dict[str, float]:
    """Calculate exact percentiles for a sorted list of numeric values."""
    n = len(sorted_values)
    if n == 0:
        return {
            "p10": 0.0, "p25": 0.0, "p50": 0.0,
            "p75": 0.0, "p90": 0.0, "p95": 0.0, "p99": 0.0
        }
    
    def get_p(p: float) -> float:
        idx = (n - 1) * p
        lower = math.floor(idx)
        upper = math.ceil(idx)
        if lower == upper:
            return float(sorted_values[int(idx)])
        weight = idx - lower
        return float(sorted_values[lower] * (1 - weight) + sorted_values[upper] * weight)

    return {
        "p10": round(get_p(0.10), 2),
        "p25": round(get_p(0.25), 2),
        "p50": round(get_p(0.50), 2),
        "p75": round(get_p(0.75), 2),
        "p90": round(get_p(0.90), 2),
        "p95": round(get_p(0.95), 2),
        "p99": round(get_p(0.99), 2),
    }


def compute_metric_summary(values: List[float], num_bins: int = 25) -> Dict[str, Any]:
    """Compute full distribution summary including mean, std_dev, percentiles, and histogram bins."""
    n = len(values)
    if n == 0:
        return {
            "count": 0, "mean": 0.0, "std_dev": 0.0,
            "min": 0.0, "max": 0.0, "p10": 0.0, "p25": 0.0,
            "p50": 0.0, "p75": 0.0, "p90": 0.0, "p95": 0.0, "p99": 0.0,
            "bins": [],
        }

    sorted_vals = sorted(values)
    min_v = sorted_vals[0]
    max_v = sorted_vals[-1]
    mean_v = sum(sorted_vals) / n
    variance = sum((x - mean_v) ** 2 for x in sorted_vals) / n
    std_dev = math.sqrt(variance)

    percentiles = calculate_percentiles(sorted_vals)

    # Build histogram bins
    bins = []
    bin_width = (max_v - min_v) / num_bins if max_v > min_v else 1.0
    bin_counts = [0] * num_bins

    for v in sorted_vals:
        b_idx = min(num_bins - 1, int((v - min_v) / bin_width))
        bin_counts[b_idx] += 1

    for i in range(num_bins):
        b_start = min_v + i * bin_width
        b_end = b_start + bin_width
        cnt = bin_counts[i]
        bins.append({
            "bin_start": round(b_start, 2),
            "bin_end": round(b_end, 2),
            "count": cnt,
            "share": round(cnt / n, 4),
        })

    return {
        "count": n,
        "mean": round(mean_v, 2),
        "std_dev": round(std_dev, 2),
        "min": round(min_v, 2),
        "max": round(max_v, 2),
        **percentiles,
        "bins": bins,
    }


class MobilityAggregator:
    """Aggregates validated trajectory datasets into canonical cubes and summaries."""

    def __init__(self, resolution: int = 7):
        self.resolution = resolution
        self.cell_origins = defaultdict(int)
        self.cell_destinations = defaultdict(int)
        self.cell_internal = defaultdict(int)
        self.cell_durations = defaultdict(list)
        self.cell_distances = defaultdict(list)
        self.cell_observations = defaultdict(int)

        self.od_flows = defaultdict(lambda: {
            "count": 0,
            "durations": [],
            "distances": [],
            "weekday_count": 0,
            "weekend_count": 0,
            "hourly": [0] * 24,
        })

        self.temporal_hourly = defaultdict(lambda: {
            "departure_count": 0,
            "arrival_count": 0,
            "weekday_count": 0,
            "weekend_count": 0,
            "durations": [],
            "distances": [],
        })

        self.day_hour_matrix = [[0 for _ in range(24)] for _ in range(7)]

        self.all_durations = []
        self.all_distances = []
        self.all_speeds = []
        self.all_displacements = []

        self.region_origins = defaultdict(int)
        self.region_destinations = defaultdict(int)
        self.region_internal = defaultdict(int)
        self.region_durations = defaultdict(list)
        self.region_distances = defaultdict(list)
        self.region_hourly = defaultdict(lambda: [0] * 24)
        self.region_connections = defaultdict(lambda: defaultdict(int))

        self.total_trajectories = 0

    def process_trajectory(self, meta: Dict[str, Any]):
        """Ingest single validated trajectory metadata record."""
        self.total_trajectories += 1

        o_lat = float(meta["origin_latitude"])
        o_lng = float(meta["origin_longitude"])
        d_lat = float(meta["destination_latitude"])
        d_lng = float(meta["destination_longitude"])
        dist = float(meta["travel_distance"])
        dur = float(meta["travel_time"])
        disp = float(meta["displacement"])
        obs_count = int(meta.get("count", 1))

        # Spatial H3 cells
        o_cell = latlng_to_cell(o_lat, o_lng, self.resolution)
        d_cell = latlng_to_cell(d_lat, d_lng, self.resolution)

        self.cell_origins[o_cell] += 1
        self.cell_destinations[d_cell] += 1
        self.cell_observations[o_cell] += obs_count
        self.cell_durations[o_cell].append(dur)
        self.cell_distances[o_cell].append(dist)

        if o_cell == d_cell:
            self.cell_internal[o_cell] += 1

        # Temporal dimensions
        dt_utc = parse_timestamp_utc(meta["departure_time"])
        temp = extract_temporal_dimensions(dt_utc)
        hour = temp["hour"]
        dow = temp["day_of_week"] # 0=Mon..6=Sun
        is_weekend = temp["day_type"] == "weekend"

        # OD Flow
        od_key = (o_cell, d_cell)
        flow = self.od_flows[od_key]
        flow["count"] += 1
        flow["durations"].append(dur)
        flow["distances"].append(dist)
        flow["hourly"][hour] += 1
        if is_weekend:
            flow["weekend_count"] += 1
        else:
            flow["weekday_count"] += 1

        # Temporal hourly cube
        th = self.temporal_hourly[hour]
        th["departure_count"] += 1
        th["durations"].append(dur)
        th["distances"].append(dist)
        if is_weekend:
            th["weekend_count"] += 1
        else:
            th["weekday_count"] += 1

        self.day_hour_matrix[dow][hour] += 1

        # Global distribution collections
        self.all_durations.append(dur)
        self.all_distances.append(dist)
        if dur > 0:
            speed_mps = dist / dur
            self.all_speeds.append(speed_mps * 3.6) # km/h
        if dist > 0:
            self.all_displacements.append(disp / dist)

        # Region analytics
        o_reg = find_region_for_point(o_lng, o_lat)
        d_reg = find_region_for_point(d_lng, d_lat)

        self.region_origins[o_reg] += 1
        self.region_destinations[d_reg] += 1
        self.region_durations[o_reg].append(dur)
        self.region_distances[o_reg].append(dist)
        self.region_hourly[o_reg][hour] += 1

        if o_reg == d_reg:
            self.region_internal[o_reg] += 1
        else:
            self.region_connections[o_reg][d_reg] += 1

    def build_h3_cells(self) -> List[Dict[str, Any]]:
        """Construct list of H3 cell activity records."""
        all_cells = set(self.cell_origins.keys()) | set(self.cell_destinations.keys())
        cell_records = []

        area = cell_area(self.resolution)

        for cell_id in all_cells:
            c_lat, c_lng = cell_to_latlng(cell_id)
            boundary = cell_to_boundary(cell_id)
            dur_list = self.cell_durations.get(cell_id, [0])
            dist_list = self.cell_distances.get(cell_id, [0])
            sorted_dur = sorted(dur_list)
            sorted_dist = sorted(dist_list)

            med_dur = sorted_dur[len(sorted_dur) // 2] if sorted_dur else 0
            med_dist = sorted_dist[len(sorted_dist) // 2] if sorted_dist else 0
            mean_dur = sum(dur_list) / len(dur_list) if dur_list else 0

            o_cnt = self.cell_origins.get(cell_id, 0)
            d_cnt = self.cell_destinations.get(cell_id, 0)

            cell_records.append({
                "cell_id": cell_id,
                "resolution": self.resolution,
                "center_lat": round(c_lat, 6),
                "center_lng": round(c_lng, 6),
                "boundary": boundary,
                "area_km2": area,
                "origin_count": o_cnt,
                "destination_count": d_cnt,
                "distinct_trajectories": o_cnt + d_cnt - self.cell_internal.get(cell_id, 0),
                "observation_count": self.cell_observations.get(cell_id, 0),
                "within_cell_trips": self.cell_internal.get(cell_id, 0),
                "incoming_count": d_cnt,
                "outgoing_count": o_cnt,
                "median_duration": round(med_dur, 1),
                "median_distance": round(med_dist, 1),
                "mean_duration": round(mean_dur, 1),
            })

        # Sort descending by combined activity
        cell_records.sort(key=lambda c: c["origin_count"] + c["destination_count"], reverse=True)
        return cell_records

    def build_od_flows(self, min_trips: int = 1) -> List[Dict[str, Any]]:
        """Construct ranked origin-destination flow records."""
        flows = []
        total = self.total_trajectories or 1

        for (o_cell, d_cell), data in self.od_flows.items():
            if data["count"] < min_trips:
                continue

            o_lat, o_lng = cell_to_latlng(o_cell)
            d_lat, d_lng = cell_to_latlng(d_cell)

            sorted_dur = sorted(data["durations"])
            sorted_dist = sorted(data["distances"])
            med_dur = sorted_dur[len(sorted_dur) // 2] if sorted_dur else 0
            med_dist = sorted_dist[len(sorted_dist) // 2] if sorted_dist else 0
            mean_dur = sum(data["durations"]) / len(data["durations"]) if data["durations"] else 0

            flows.append({
                "origin_cell": o_cell,
                "destination_cell": d_cell,
                "origin_coords": [round(o_lng, 6), round(o_lat, 6)],
                "destination_coords": [round(d_lng, 6), round(d_lat, 6)],
                "trip_count": data["count"],
                "share": round(data["count"] / total, 5),
                "median_duration": round(med_dur, 1),
                "mean_duration": round(mean_dur, 1),
                "median_distance": round(med_dist, 1),
                "weekday_count": data["weekday_count"],
                "weekend_count": data["weekend_count"],
                "weekday_share": round(data["weekday_count"] / data["count"], 3) if data["count"] else 0,
                "weekend_share": round(data["weekend_count"] / data["count"], 3) if data["count"] else 0,
                "departure_hour_distribution": data["hourly"],
            })

        flows.sort(key=lambda f: f["trip_count"], reverse=True)
        return flows

    def build_temporal_summary(self) -> Dict[str, Any]:
        """Construct temporal profiles and day-by-hour matrices."""
        hourly_profiles = []
        for h in range(24):
            th = self.temporal_hourly[h]
            dur_list = sorted(th["durations"]) if th["durations"] else [0]
            dist_list = sorted(th["distances"]) if th["distances"] else [0]
            hourly_profiles.append({
                "hour": h,
                "departure_count": th["departure_count"],
                "weekday_count": th["weekday_count"],
                "weekend_count": th["weekend_count"],
                "median_duration": round(dur_list[len(dur_list) // 2], 1),
                "median_distance": round(dist_list[len(dist_list) // 2], 1),
            })

        return {
            "hourly_profiles": hourly_profiles,
            "day_hour_matrix": self.day_hour_matrix, # 7 x 24
        }

    def build_distributions(self) -> Dict[str, Any]:
        """Construct trip distribution metrics and joint distance/duration histograms."""
        duration_summary = compute_metric_summary(self.all_durations, num_bins=30)
        distance_summary = compute_metric_summary(self.all_distances, num_bins=30)
        speed_summary = compute_metric_summary(self.all_speeds, num_bins=25)
        displacement_summary = compute_metric_summary(self.all_displacements, num_bins=20)

        # Joint 10x10 density matrix of distance vs duration
        joint_grid = [[0 for _ in range(10)] for _ in range(10)]
        max_dist = distance_summary["p99"] or 1.0
        max_dur = duration_summary["p99"] or 1.0

        for dist, dur in zip(self.all_distances, self.all_durations):
            x_bin = min(9, int((dist / max_dist) * 10))
            y_bin = min(9, int((dur / max_dur) * 10))
            joint_grid[x_bin][y_bin] += 1

        total_pts = len(self.all_distances) or 1
        joint_density = []
        for x in range(10):
            for y in range(10):
                cnt = joint_grid[x][y]
                if cnt > 0:
                    joint_density.append({
                        "distance_bin": x,
                        "duration_bin": y,
                        "count": cnt,
                        "density": round(cnt / total_pts, 4),
                    })

        return {
            "duration": duration_summary,
            "distance": distance_summary,
            "average_speed": speed_summary,
            "displacement_ratio": displacement_summary,
            "joint_density": joint_density,
        }

    def build_regions(self) -> List[Dict[str, Any]]:
        """Construct analytical region summaries for the 9 key LA exploration regions."""
        regions = []
        for reg_id, reg in LA_REGIONS.items():
            o_cnt = self.region_origins.get(reg_id, 0)
            d_cnt = self.region_destinations.get(reg_id, 0)
            internal_cnt = self.region_internal.get(reg_id, 0)
            durs = sorted(self.region_durations.get(reg_id, [0]))
            dists = sorted(self.region_distances.get(reg_id, [0]))

            med_dur = durs[len(durs) // 2] if durs else 0
            med_dist = dists[len(dists) // 2] if dists else 0

            # Find top connected regions
            conn_map = self.region_connections.get(reg_id, {})
            top_conn = []
            for target_id, count in sorted(conn_map.items(), key=lambda x: x[1], reverse=True)[:5]:
                name = LA_REGIONS.get(target_id, {}).get("name", target_id)
                top_conn.append({
                    "region_id": target_id,
                    "name": name,
                    "trip_count": count,
                })

            regions.append({
                "region_id": reg_id,
                "name": reg["name"],
                "description": reg["description"],
                "boundary_type": reg["boundary_type"],
                "center": reg["center"],
                "bounding_box": reg["bounding_box"],
                "total_origins": o_cnt,
                "total_destinations": d_cnt,
                "internal_trips": internal_cnt,
                "incoming_trips": d_cnt - internal_cnt,
                "outgoing_trips": o_cnt - internal_cnt,
                "median_distance": round(med_dist, 1),
                "median_duration": round(med_dur, 1),
                "top_connected_regions": top_conn,
                "hourly_activity": self.region_hourly.get(reg_id, [0] * 24),
            })

        return regions
