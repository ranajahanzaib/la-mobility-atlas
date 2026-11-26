# Primary Research Dataset

## Dataset Identification

- **Title**: Synthetic vehicle trajectory dataset for the metropolitan city of Los Angeles using DDTG
- **Authors**: Chrysovalantis Anastasiou, Seon Ho Kim, Cyrus Shahabi
- **Permanent DOI**: [10.5061/dryad.4j0zpc8gf](https://doi.org/10.5061/dryad.4j0zpc8gf)
- **Zenodo Archive**: [zenodo.org/records/7391400](https://zenodo.org/records/7391400)
- **Publication Date**: 2022
- **Temporal Coverage**: December 1, 2019 – December 14, 2019 (2 continuous weeks)

## Geographic Bounding Box

```
North Latitude:  34.335035° N
South Latitude:  33.699820° N
West Longitude: -118.667665° W
East Longitude: -118.180532° W
```

## Raw Parquet Schemas

### `trajectory_meta.parquet`
- `uuid` (string): Synthetic vehicle entity identifier
- `tuid` (string): Trajectory trip identifier
- `origin_latitude` (float64): Trip departure coordinate
- `origin_longitude` (float64): Trip departure coordinate
- `destination_latitude` (float64): Trip destination coordinate
- `destination_longitude` (float64): Trip destination coordinate
- `departure_time` (string): ISO 8601 UTC timestamp
- `travel_distance` (float64): Meters along road network
- `travel_time` (float64): Trip duration in seconds
- `displacement` (float64): Euclidean straight-line distance in meters
- `count` (int64): Number of GPS coordinate observations recorded

### `trajectories.parquet`
- `uuid` (string): Vehicle identifier
- `tuid` (string): Trajectory identifier
- `latitude` (float64): Geographic coordinate
- `longitude` (float64): Geographic coordinate
- `accuracy` (int64): Note: Unused in this dataset version
- `timestamp` (string): ISO 8601 UTC timestamp
