"""
End-to-end dataset publishing and artifact generation engine for LA Mobility Atlas.
Processes validated trajectory data, generates analytical cubes, playback chunks,
and writes immutable release artifacts and manifest files.
"""

import os
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional

from mobility.spatial.h3_grid import LA_BBOX
from mobility.validation.validator import DatasetValidator
from mobility.normalization.normalizer import normalize_metadata_record, normalize_observation_record
from mobility.aggregation.aggregator import MobilityAggregator
from mobility.trajectories.chunks import PlaybackChunker
from mobility.ingestion.sample import generate_research_sample
from mobility.tiles.builder import build_h3_cells_geojson, build_regions_geojson


def run_pipeline_and_publish(
    meta_path: Optional[str] = None,
    obs_path: Optional[str] = None,
    output_dir: str = "data/processed",
    web_public_dir: str = "apps/web/public/data",
    release_id: str = "rel-2019-12-v1",
) -> Dict[str, Any]:
    """Execute complete mobility analytics pipeline and publish artifacts."""
    print(f"[Publisher] Starting LA Mobility Atlas publishing pipeline: {release_id}")

    # 1. Load or generate data
    if meta_path and Path(meta_path).exists() and obs_path and Path(obs_path).exists():
        print(f"[Publisher] Loading data from {meta_path} and {obs_path}")
        with open(meta_path, "r") as f:
            raw_meta = json.load(f)
        with open(obs_path, "r") as f:
            raw_obs = json.load(f)
    else:
        print("[Publisher] Source path not provided or not found. Generating deterministic research fixture...")
        raw_meta, raw_obs = generate_research_sample()

    # 2. Validation stage
    validator = DatasetValidator(bbox=LA_BBOX)
    valid_meta = []
    for row in raw_meta:
        is_valid, _ = validator.validate_metadata_row(row)
        if is_valid:
            valid_meta.append(row)

    valid_obs = []
    for row in raw_obs:
        is_valid, _ = validator.validate_observation_row(row)
        if is_valid:
            valid_obs.append(row)

    val_report = validator.get_validation_report()
    print(f"[Publisher] Validation complete: {val_report['metadata_valid']}/{val_report['metadata_total']} metadata records valid.")

    # 3. Normalization and Aggregation
    aggregator = MobilityAggregator(resolution=7)
    normalized_meta = []
    for row in valid_meta:
        norm_row = normalize_metadata_record(row, resolution=7)
        normalized_meta.append(norm_row)
        aggregator.process_trajectory(row)

    # 4. Trajectory Playback Chunker
    # Group observations by tuid
    obs_by_tuid = {}
    for obs in valid_obs:
        tuid = obs["tuid"]
        if tuid not in obs_by_tuid:
            obs_by_tuid[tuid] = []
        obs_by_tuid[tuid].append(obs)

    chunker = PlaybackChunker(target_sample_rate=0.10)
    for meta in normalized_meta:
        tuid = meta["tuid"]
        if tuid in obs_by_tuid:
            chunker.add_trajectory(
                traj_id=meta["uuid"],
                tuid=tuid,
                departure_time=meta["departure_time"],
                observations=obs_by_tuid[tuid],
                color_category=meta["day_type"],
            )

    playback_chunks = chunker.export_chunks()

    # 5. Build analytical artifacts
    cells = aggregator.build_h3_cells()
    flows = aggregator.build_od_flows(min_trips=1)
    temporal = aggregator.build_temporal_summary()
    distributions = aggregator.build_distributions()
    regions = aggregator.build_regions()

    # Overview metrics
    peak_hour = max(
        range(24),
        key=lambda h: temporal["hourly_profiles"][h]["departure_count"]
    ) if temporal["hourly_profiles"] else 17

    overview = {
        "release_id": release_id,
        "total_trajectories": len(valid_meta),
        "total_observations": len(valid_obs),
        "coverage_start": "2019-12-01T00:00:00Z",
        "coverage_end": "2019-12-14T23:59:59Z",
        "median_duration_seconds": distributions["duration"]["p50"],
        "median_distance_meters": distributions["distance"]["p50"],
        "peak_departure_hour": peak_hour,
        "active_origin_cells": len([c for c in cells if c["origin_count"] > 0]),
        "active_destination_cells": len([c for c in cells if c["destination_count"] > 0]),
        "bounding_box": LA_BBOX,
        "validation_report": val_report,
    }

    manifest = {
        "release_id": release_id,
        "source_name": "Synthetic vehicle trajectory dataset for the metropolitan city of Los Angeles using DDTG",
        "doi": "10.5061/dryad.4j0zpc8gf",
        "zenodo_record": 7391400,
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "schema_version": "1.0.0",
        "processing_version": "1.0.0",
        "supported_h3_resolutions": [6, 7, 8],
        "overview": overview,
        "artifacts": {
            "manifest": "manifest.json",
            "overview": "overview.json",
            "cells": "cells.json",
            "flows": "flows.json",
            "temporal": "temporal.json",
            "distributions": "distributions.json",
            "regions": "regions.json",
            "playback_manifest": "playback/manifest.json",
        },
    }

    # 6. Write to output release directory
    rel_dir = Path(output_dir) / "releases" / release_id
    rel_dir.mkdir(parents=True, exist_ok=True)
    playback_dir = rel_dir / "playback"
    playback_dir.mkdir(parents=True, exist_ok=True)

    with open(rel_dir / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    with open(rel_dir / "overview.json", "w") as f:
        json.dump(overview, f, indent=2)
    with open(rel_dir / "cells.json", "w") as f:
        json.dump(cells, f, indent=2)
    with open(rel_dir / "flows.json", "w") as f:
        json.dump(flows, f, indent=2)
    with open(rel_dir / "temporal.json", "w") as f:
        json.dump(temporal, f, indent=2)
    with open(rel_dir / "distributions.json", "w") as f:
        json.dump(distributions, f, indent=2)
    with open(rel_dir / "regions.json", "w") as f:
        json.dump(regions, f, indent=2)

    # Write playback manifest and chunks
    playback_manifest = {
        "release_id": release_id,
        "total_chunks": len(playback_chunks),
        "total_playback_trajectories": sum(c["trajectory_count"] for c in playback_chunks),
        "chunks": [
            {
                "chunk_id": c["chunk_id"],
                "start_timestamp": c["start_timestamp"],
                "end_timestamp": c["end_timestamp"],
                "trajectory_count": c["trajectory_count"],
                "point_count": c["point_count"],
                "file": f"playback/{c['chunk_id']}.json",
            }
            for c in playback_chunks
        ]
    }
    with open(playback_dir / "manifest.json", "w") as f:
        json.dump(playback_manifest, f, indent=2)

    for chunk in playback_chunks:
        with open(playback_dir / f"{chunk['chunk_id']}.json", "w") as f:
            json.dump(chunk, f)

    # Write current.json pointer
    current_pointer = {
        "current_release": release_id,
        "updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "manifest_path": f"releases/{release_id}/manifest.json",
    }
    with open(Path(output_dir) / "current.json", "w") as f:
        json.dump(current_pointer, f, indent=2)

    # Also mirror to web_public_dir for seamless static export and local dev
    web_dir = Path(web_public_dir)
    web_dir.mkdir(parents=True, exist_ok=True)
    web_playback_dir = web_dir / "playback"
    web_playback_dir.mkdir(parents=True, exist_ok=True)

    with open(web_dir / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    with open(web_dir / "overview.json", "w") as f:
        json.dump(overview, f, indent=2)
    with open(web_dir / "cells.json", "w") as f:
        json.dump(cells, f, indent=2)
    with open(web_dir / "flows.json", "w") as f:
        json.dump(flows, f, indent=2)
    with open(web_dir / "temporal.json", "w") as f:
        json.dump(temporal, f, indent=2)
    with open(web_dir / "distributions.json", "w") as f:
        json.dump(distributions, f, indent=2)
    with open(web_dir / "regions.json", "w") as f:
        json.dump(regions, f, indent=2)
    with open(web_playback_dir / "manifest.json", "w") as f:
        json.dump(playback_manifest, f, indent=2)

    for chunk in playback_chunks:
        with open(web_playback_dir / f"{chunk['chunk_id']}.json", "w") as f:
            json.dump(chunk, f)

    print(f"[Publisher] Pipeline succeeded! Published {len(cells)} cells, {len(flows)} OD flows, {len(playback_chunks)} playback chunks.")
    return manifest


if __name__ == "__main__":
    run_pipeline_and_publish()
