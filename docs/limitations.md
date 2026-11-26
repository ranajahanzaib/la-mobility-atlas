# Scientific Limitations and Responsible Data Use

This document details the scientific context, data generation assumptions, and responsible usage guidelines for the synthetic DDTG Los Angeles mobility dataset.

---

## 1. Nature of Synthetic Data

The trajectories in this platform are generated using the **DDTG (Data-Driven Trajectory Generator)** framework developed by researchers at the University of Southern California (Anastasiou, Kim, Shahabi; DOI: `10.5061/dryad.4j0zpc8gf`).

### What This Dataset Is:
- A mathematically synthesized, privacy-preserving representation of vehicle mobility patterns across metropolitan Los Angeles.
- Calibrated against macro-level traffic counts, road network topologies (OpenStreetMap), and origin-destination demand matrices.
- Designed for algorithmic benchmarking, spatial indexing research, and privacy-preserving urban analytics.

### What This Dataset Is NOT:
- **Not Live GPS Feeds**: Points do not correspond to physical GPS receivers in real-world motor vehicles.
- **Not Individual Vehicle Diaries**: No individual person's real-world movements are recorded.
- **Not Live Traffic Reports**: The dataset does not reflect current real-time road congestion, accidents, or construction.

---

## 2. Explicit Restrictions on Inferential Claims

Users, researchers, and platform operators must observe strict scientific boundaries. **Do NOT infer or claim**:

1. **Trip Purpose or Intent**: Do not classify trips as "work commutes", "recreational outings", or "school drop-offs" without external ground-truth validation.
2. **Driver or Commuter Identity**: Trajectories are anonymous synthetic paths; never attempt re-identification or linkage to demographic datasets.
3. **Socio-Economic Characteristics**: Geographic origins and destinations must not be used to infer personal income, ethnicity, or demographic traits of hypothetical vehicle occupants.
4. **Exact Real-World Congestion**: Route choices in the simulator reflect algorithmically synthesized shortest-path or stochastic routing models rather than observed human detour behaviors.

---

## 3. Geographic & Temporal Boundaries

- **Spatial Universe**: Strictly limited to the bounding box:
  - North: $34.335035^\circ$
  - South: $33.699820^\circ$
  - West: $-118.667665^\circ$
  - East: $-118.180532^\circ$
- **Temporal Window**: First two weeks of December 2019 (`2019-12-01` to `2019-12-14`).
- **Seasonal Sensitivity**: Mobility patterns in early December reflect pre-holiday travel and pre-COVID metropolitan dynamics. They do not generalize to post-2020 hybrid work conditions without calibration.

---

## 4. Citation and Attribution

When using or referencing data products derived from this platform, cite the original dataset creators:

```bibtex
@dataset{anastasiou_2022_ddtg_la,
  author    = {Anastasiou, Chrysovalantis and Kim, Seon Ho and Shahabi, Cyrus},
  title     = {Synthetic vehicle trajectory dataset for the metropolitan city of Los Angeles using DDTG},
  year      = {2022},
  publisher = {Dryad},
  doi       = {10.5061/dryad.4j0zpc8gf}
}
```
