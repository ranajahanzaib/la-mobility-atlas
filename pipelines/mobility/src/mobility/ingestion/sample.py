"""
Deterministic research fixture generator conforming to the DDTG schema.
Provides isolated, explicitly labeled testing fixtures for development, testing,
and validation when source files cannot be fetched from remote repositories.
"""

import json
import math
import random
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Tuple
from pathlib import Path
from mobility.spatial.h3_grid import LA_BBOX
from mobility.spatial.regions import LA_REGIONS

RNG_SEED = 42

# 16 Comprehensive LA transportation corridors connecting all 9 regions and suburbs
CORRIDORS = [
    # 1. I-10 Santa Monica Freeway (Santa Monica -> Culver City -> Mid-City -> DTLA)
    [
        [-118.4912, 34.0195], [-118.4350, 34.0310], [-118.3965, 34.0211],
        [-118.3500, 34.0350], [-118.2900, 34.0400], [-118.2518, 34.0488]
    ],
    # 2. I-405 San Diego Freeway (Westwood -> Palms -> Westchester -> LAX)
    [
        [-118.4452, 34.0689], [-118.4500, 34.0350], [-118.4100, 33.9900], [-118.4085, 33.9416]
    ],
    # 3. US-101 Hollywood Freeway (Hollywood -> East Hollywood -> Silver Lake -> DTLA)
    [
        [-118.3287, 34.1016], [-118.3000, 34.0850], [-118.2800, 34.0700], [-118.2518, 34.0488]
    ],
    # 4. Wilshire Blvd Corridor (Santa Monica -> Westwood -> Beverly Hills -> Koreatown -> DTLA)
    [
        [-118.4912, 34.0195], [-118.4452, 34.0689], [-118.3700, 34.0630],
        [-118.3000, 34.0600], [-118.2518, 34.0488]
    ],
    # 5. I-110 Harbor Freeway (DTLA -> Exposition Park -> South LA -> Athens)
    [
        [-118.2518, 34.0488], [-118.2800, 34.0150], [-118.2800, 33.9900], [-118.2820, 33.9450]
    ],
    # 6. Venice Blvd (Venice Beach -> Mar Vista -> Culver City -> Mid-City -> DTLA)
    [
        [-118.4695, 33.9850], [-118.4200, 34.0050], [-118.3965, 34.0211],
        [-118.3200, 34.0380], [-118.2518, 34.0488]
    ],
    # 7. Sunset Blvd (Hollywood -> West Hollywood -> Beverly Hills -> Westwood -> Pacific Palisades)
    [
        [-118.3287, 34.1016], [-118.3650, 34.0980], [-118.4150, 34.0820],
        [-118.4452, 34.0689], [-118.5200, 34.0450]
    ],
    # 8. Sepulveda Blvd (LAX -> Culver City -> Westwood -> Sherman Oaks)
    [
        [-118.4085, 33.9416], [-118.3965, 34.0211], [-118.4452, 34.0689], [-118.4600, 34.1500]
    ],
    # 9. Lincoln Blvd & PCH (Santa Monica -> Venice -> Marina del Rey -> LAX)
    [
        [-118.4912, 34.0195], [-118.4695, 33.9850], [-118.4400, 33.9750], [-118.4085, 33.9416]
    ],
    # 10. Olympic Blvd (Santa Monica -> Century City -> Koreatown -> DTLA)
    [
        [-118.4750, 34.0260], [-118.4150, 34.0550], [-118.3000, 34.0530], [-118.2518, 34.0488]
    ],
    # 11. Western Ave (Hollywood -> Koreatown -> South LA)
    [
        [-118.3090, 34.1016], [-118.3090, 34.0600], [-118.3090, 33.9900], [-118.3090, 33.9450]
    ],
    # 12. Vermont Ave (Los Feliz -> Koreatown -> Exposition Park -> South LA)
    [
        [-118.2915, 34.1050], [-118.2915, 34.0600], [-118.2915, 34.0150], [-118.2915, 33.9700]
    ],
    # 13. Slauson Ave East-West (Culver City / Ladera -> Hyde Park -> South LA -> Huntington Park)
    [
        [-118.3800, 33.9880], [-118.3300, 33.9890], [-118.2800, 33.9890], [-118.2200, 33.9890]
    ],
    # 14. Manchester Ave (Playa del Rey -> Westchester -> South LA -> Watts)
    [
        [-118.4400, 33.9600], [-118.3800, 33.9600], [-118.2800, 33.9600], [-118.2400, 33.9600]
    ],
    # 15. Cahuenga Blvd / Highland Ave (Studio City -> Hollywood Bowl -> Hollywood -> Hancock Park)
    [
        [-118.3650, 34.1400], [-118.3380, 34.1120], [-118.3287, 34.1016], [-118.3380, 34.0650]
    ],
    # 16. La Cienega Blvd (West Hollywood -> Beverly Center -> Culver City -> LAX)
    [
        [-118.3760, 34.0900], [-118.3760, 34.0650], [-118.3760, 34.0250], [-118.3760, 33.9600]
    ],
]


def haversine_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    lng1, lat1 = coord1
    lng2, lat2 = coord2
    R = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


def interpolate_route(waypoints: List[List[float]], num_points: int) -> List[Tuple[float, float]]:
    if num_points <= len(waypoints):
        return [(p[0], p[1]) for p in waypoints]

    total_dist = 0.0
    segments = []
    for i in range(len(waypoints) - 1):
        d = haversine_distance(tuple(waypoints[i]), tuple(waypoints[i + 1]))
        segments.append(d)
        total_dist += d

    if total_dist == 0:
        return [(waypoints[0][0], waypoints[0][1])] * num_points

    coords = []
    for step in range(num_points):
        frac = step / (num_points - 1)
        target_dist = frac * total_dist

        accum = 0.0
        seg_idx = 0
        while seg_idx < len(segments) - 1 and accum + segments[seg_idx] < target_dist:
            accum += segments[seg_idx]
            seg_idx += 1

        seg_len = segments[seg_idx]
        seg_frac = (target_dist - accum) / seg_len if seg_len > 0 else 0.0

        p0 = waypoints[seg_idx]
        p1 = waypoints[seg_idx + 1]

        jitter_x = (random.random() - 0.5) * 0.00015
        jitter_y = (random.random() - 0.5) * 0.00015

        lng = p0[0] + (p1[0] - p0[0]) * seg_frac + jitter_x
        lat = p0[1] + (p1[1] - p0[1]) * seg_frac + jitter_y
        coords.append((round(lng, 6), round(lat, 6)))

    return coords


def generate_research_sample(
    num_trajectories: int = 2500,
    output_dir: str = "data/fixtures"
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    random.seed(RNG_SEED)

    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    metadata_records = []
    observation_records = []

    start_date = datetime(2019, 12, 1, 0, 0, 0, tzinfo=timezone.utc)

    # Commute profile with dual peaks: 07:00-09:00 (morning) and 16:00-19:00 (evening)
    hour_weights = [
        0.01, 0.01, 0.01, 0.01, 0.02, 0.04,
        0.08, 0.12, 0.10, 0.06, 0.05, 0.06,
        0.07, 0.06, 0.06, 0.08, 0.11, 0.12,
        0.09, 0.06, 0.04, 0.03, 0.02, 0.01
    ]

    for i in range(num_trajectories):
        uuid_str = f"u-{i % 600:04d}"
        tuid_str = f"t-{i:06d}"

        day_offset = random.randint(0, 13)
        hour = random.choices(range(24), weights=hour_weights)[0]
        minute = random.randint(0, 59)
        second = random.randint(0, 59)

        dep_dt = start_date + timedelta(days=day_offset, hours=hour, minutes=minute, seconds=second)

        corridor = random.choice(CORRIDORS)
        reverse_dir = random.random() < 0.5
        waypoints = list(reversed(corridor)) if reverse_dir else corridor

        # Randomize sub-segment to create varied trip lengths (short, medium, long)
        if len(waypoints) > 3 and random.random() < 0.4:
            start_idx = random.randint(0, len(waypoints) - 3)
            end_idx = random.randint(start_idx + 2, len(waypoints))
            waypoints = waypoints[start_idx:end_idx]

        num_obs = random.randint(18, 42)
        route_coords = interpolate_route(waypoints, num_obs)

        o_lng, o_lat = route_coords[0]
        d_lng, d_lat = route_coords[-1]

        displacement = haversine_distance((o_lng, o_lat), (d_lng, d_lat))
        detour_factor = random.uniform(1.08, 1.25)
        travel_distance = displacement * detour_factor

        avg_speed_mps = random.uniform(7.5, 17.5)
        travel_time_sec = travel_distance / avg_speed_mps

        obs_interval_sec = travel_time_sec / (num_obs - 1)

        meta_rec = {
            "uuid": uuid_str,
            "tuid": tuid_str,
            "origin_latitude": o_lat,
            "origin_longitude": o_lng,
            "destination_latitude": d_lat,
            "destination_longitude": d_lng,
            "departure_time": dep_dt.isoformat().replace("+00:00", "Z"),
            "travel_distance": round(travel_distance, 1),
            "travel_time": round(travel_time_sec, 1),
            "displacement": round(displacement, 1),
            "count": num_obs,
            "provenance": "deterministic_testing_fixture_synthetic_ddtg_schema",
        }
        metadata_records.append(meta_rec)

        for step_idx, (lng, lat) in enumerate(route_coords):
            obs_dt = dep_dt + timedelta(seconds=step_idx * obs_interval_sec)
            obs_rec = {
                "uuid": uuid_str,
                "tuid": tuid_str,
                "latitude": lat,
                "longitude": lng,
                "accuracy": 0,
                "timestamp": obs_dt.isoformat().replace("+00:00", "Z"),
            }
            observation_records.append(obs_rec)

    meta_file = out_path / "trajectory_meta_sample.json"
    obs_file = out_path / "trajectories_sample.json"

    with open(meta_file, "w") as f:
        json.dump(metadata_records, f, indent=2)

    with open(obs_file, "w") as f:
        json.dump(observation_records, f, indent=2)

    print(f"Generated {len(metadata_records)} metadata records and {len(observation_records)} observations.")
    return metadata_records, observation_records


if __name__ == "__main__":
    generate_research_sample()
