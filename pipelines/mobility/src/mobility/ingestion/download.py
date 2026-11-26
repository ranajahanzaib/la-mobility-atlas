"""
Download and source discovery stage for the DDTG Los Angeles trajectory dataset.
Supports official Dryad DOI: 10.5061/dryad.4j0zpc8gf and Zenodo record: 7391400.
Also detects locally supplied or pre-downloaded source parquet files.
"""

import os
import sys
import hashlib
from pathlib import Path
from typing import Dict, Any, Optional

ZENODO_RECORD_URL = "https://zenodo.org/api/records/7391400"
DRYAD_DOI_URL = "https://doi.org/10.5061/dryad.4j0zpc8gf"

EXPECTED_FILES = {
    "trajectories.parquet": {
        "description": "Trajectory coordinate observations",
        "approx_size_mb": 1500,
    },
    "trajectory_meta.parquet": {
        "description": "Trajectory metadata, endpoints, and summary metrics",
        "approx_size_mb": 45,
    },
    "README.md": {
        "description": "Original authors dataset documentation and scientific notes",
        "approx_size_mb": 0.01,
    },
}


def find_local_source_files(search_dir: str = "data/raw") -> Dict[str, Optional[Path]]:
    """Scan directory for existing parquet files."""
    base = Path(search_dir)
    results = {}
    for filename in EXPECTED_FILES.keys():
        file_path = base / filename
        results[filename] = file_path if file_path.exists() else None
    return results


def verify_file_checksum(file_path: Path, expected_sha256: Optional[str] = None) -> str:
    """Compute SHA-256 hash of a file."""
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192 * 1024):
            sha256.update(chunk)
    computed = sha256.hexdigest()
    if expected_sha256 and computed.lower() != expected_sha256.lower():
        raise ValueError(f"Checksum mismatch for {file_path.name}: expected {expected_sha256}, got {computed}")
    return computed


def run_source_discovery(raw_dir: str = "data/raw") -> Dict[str, Any]:
    """Discover available source files or report instructions for download."""
    Path(raw_dir).mkdir(parents=True, exist_ok=True)
    found = find_local_source_files(raw_dir)
    
    missing = [k for k, v in found.items() if v is None]
    if missing:
        print(f"[Discovery] Missing raw files in {raw_dir}: {missing}")
        print(f"[Discovery] Source dataset may be acquired from Zenodo: {ZENODO_RECORD_URL}")
        print(f"[Discovery] or Dryad: {DRYAD_DOI_URL}")
        return {
            "status": "files_missing",
            "found_files": {k: str(v) for k, v in found.items() if v is not None},
            "missing_files": missing,
            "zenodo_url": ZENODO_RECORD_URL,
            "dryad_url": DRYAD_DOI_URL,
        }
    
    return {
        "status": "ready",
        "found_files": {k: str(v) for k, v in found.items()},
    }


if __name__ == "__main__":
    run_source_discovery()
