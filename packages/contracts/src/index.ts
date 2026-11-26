/**
 * @la-mobility-atlas/contracts
 * Canonical type definitions and schemas for LA Mobility Atlas
 */

export interface BoundingBox {
  north: number;
  south: number;
  west: number;
  east: number;
}

export const LA_BOUNDING_BOX: BoundingBox = {
  north: 34.335035,
  south: 33.69982,
  west: -118.667665,
  east: -118.180532,
};

export interface DatasetManifest {
  release_id: string;
  source_name: string;
  doi: string;
  zenodo_record: number;
  coverage_start: string;
  coverage_end: string;
  bounding_box: BoundingBox;
  total_trajectories: number;
  total_observations: number;
  median_duration_seconds: number;
  median_distance_meters: number;
  peak_departure_hour: number;
  active_origin_cells: number;
  active_destination_cells: number;
  generated_at: string;
  schema_version: string;
  processing_version: string;
  supported_h3_resolutions: number[];
  artifacts: {
    manifest: string;
    overview: string;
    cells: string;
    flows: string;
    temporal: string;
    distributions: string;
    regions: string;
    playback_chunks: string;
  };
}

export interface TrajectoryMetadata {
  uuid: string;
  tuid: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  departure_time: string; // ISO 8601 UTC
  travel_distance: number; // meters
  travel_time: number; // seconds
  displacement: number; // meters
  count: number;
}

export interface TrajectoryObservation {
  uuid: string;
  tuid: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string; // ISO 8601 UTC
}

export interface H3CellActivity {
  cell_id: string;
  resolution: number;
  center_lat: number;
  center_lng: number;
  boundary?: Array<[number, number]>; // [lng, lat]
  area_km2: number;
  origin_count: number;
  destination_count: number;
  distinct_trajectories: number;
  observation_count: number;
  within_cell_trips: number;
  incoming_count: number;
  outgoing_count: number;
  median_duration: number;
  median_distance: number;
  mean_duration: number;
}

export interface ODFlow {
  origin_cell: string;
  destination_cell: string;
  origin_coords: [number, number]; // [lng, lat]
  destination_coords: [number, number]; // [lng, lat]
  trip_count: number;
  share: number;
  median_duration: number;
  mean_duration: number;
  median_distance: number;
  weekday_count: number;
  weekend_count: number;
  weekday_share: number;
  weekend_share: number;
  departure_hour_distribution: number[]; // 24 bins
}

export interface TemporalProfile {
  hour: number;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  departure_count: number;
  arrival_count: number;
  active_count: number;
  weekday_count: number;
  weekend_count: number;
  median_duration: number;
  median_distance: number;
}

export interface DistributionBin {
  bin_start: number;
  bin_end: number;
  count: number;
  share: number;
}

export interface MetricSummary {
  count: number;
  mean: number;
  std_dev: number;
  min: number;
  max: number;
  p10: number;
  p25: number;
  p50: number; // median
  p75: number;
  p90: number;
  p95: number;
  p99: number;
  bins: DistributionBin[];
}

export interface JointDensityPoint {
  distance_bin: number;
  duration_bin: number;
  count: number;
  density: number;
}

export interface TripDistributions {
  duration: MetricSummary;
  distance: MetricSummary;
  average_speed: MetricSummary;
  displacement_ratio: MetricSummary;
  joint_density: JointDensityPoint[];
}

export interface RegionSummary {
  region_id: string;
  name: string;
  description: string;
  boundary_type: "polygon" | "h3_cluster";
  center: [number, number]; // [lng, lat]
  bounding_box: BoundingBox;
  h3_cells: string[];
  total_origins: number;
  total_destinations: number;
  internal_trips: number;
  incoming_trips: number;
  outgoing_trips: number;
  median_distance: number;
  median_duration: number;
  top_connected_regions: Array<{
    region_id: string;
    name: string;
    trip_count: number;
  }>;
  hourly_activity: number[]; // 24 hours
}

export interface PlaybackTrajectory {
  id: string;
  tuid: string;
  departure_time: string;
  duration_seconds: number;
  distance_meters: number;
  origin_cell: string;
  destination_cell: string;
  color_category?: string;
  /**
   * Path coordinates: [longitude, latitude, timestamp_offset_seconds]
   */
  path: Array<[number, number, number]>;
}

export interface PlaybackChunk {
  chunk_id: string;
  start_timestamp: string;
  end_timestamp: string;
  trajectory_count: number;
  point_count: number;
  sampling_rate: number; // e.g. 0.05 for 5% deterministic sample
  sampling_method: string;
  trajectories: PlaybackTrajectory[];
}

export interface CompareAnalysis {
  baseline_name: string;
  comparison_name: string;
  baseline_days_count: number;
  comparison_days_count: number;
  baseline_total_trips: number;
  comparison_total_trips: number;
  normalized_baseline_daily_trips: number;
  normalized_comparison_daily_trips: number;
  percent_difference: number;
  baseline_median_duration: number;
  comparison_median_duration: number;
  baseline_median_distance: number;
  comparison_median_distance: number;
  hourly_comparison: Array<{
    hour: number;
    baseline_hourly: number;
    comparison_hourly: number;
    difference: number;
    percent_change: number | null;
  }>;
  top_diverging_cells: Array<{
    cell_id: string;
    center: [number, number];
    baseline_count: number;
    comparison_count: number;
    diff: number;
  }>;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "region" | "h3_cell" | "preset" | "route" | "metric";
  action_type: "navigate" | "filter" | "zoom";
  coordinates?: [number, number];
  zoom?: number;
  target_url?: string;
}
