# Analytical Data Model

Canonical entities within the LA Mobility Atlas model:

## 1. `H3CellActivity`
- `cell_id`: H3 hexagonal index string (e.g. `8729a1...`)
- `resolution`: Spatial resolution (6, 7, or 8)
- `center_lat`, `center_lng`: Centroid coordinates
- `boundary`: Closed polygon coordinates array `[[lng, lat], ...]`
- `area_km2`: Average cell surface area in square kilometers
- `origin_count`: Number of trips departing within cell
- `destination_count`: Number of trips terminating within cell
- `distinct_trajectories`: Distinct vehicle presence
- `observation_count`: Total coordinate samples recorded in cell
- `median_duration`, `median_distance`: Centroid travel statistics

## 2. `ODFlow`
- `origin_cell`: Departure H3 cell ID
- `destination_cell`: Arrival H3 cell ID
- `origin_coords`, `destination_coords`: Centroid positions
- `trip_count`: Volume of generated vehicle trips
- `share`: Share of all metropolitan flow activity
- `weekday_share`, `weekend_share`: Day-type flow proportions
- `departure_hour_distribution`: 24-bin histogram array

## 3. `PlaybackChunk`
- `chunk_id`: Partition identifier (e.g. `chunk-2019-12-02`)
- `start_timestamp`, `end_timestamp`: Bounding temporal range
- `trajectory_count`: Number of trajectories contained
- `trajectories`: Array of `PlaybackTrajectory` with relative second offsets: `[lng, lat, offset_seconds]`.
