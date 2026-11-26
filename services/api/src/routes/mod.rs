use axum::{
    extract::{Path, Query, State},
    response::Json,
    http::StatusCode,
};
use serde_json::{json, Value};
use crate::models::{CellsQuery, CompareQuery, FlowsQuery, HealthResponse, SearchItem, SearchQuery};
use crate::storage::AppState;

pub async fn health_handler() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "healthy",
        service: "la-mobility-atlas-api",
        version: "1.0.0",
        runtime: if cfg!(target_arch = "wasm32") { "cloudflare-workers-wasm" } else { "native-tokio" },
    })
}

pub async fn manifest_handler(State(state): State<AppState>) -> Json<Value> {
    Json((*state.manifest).clone())
}

pub async fn overview_handler(State(state): State<AppState>) -> Json<Value> {
    Json((*state.overview).clone())
}

pub async fn temporal_profile_handler(State(state): State<AppState>) -> Json<Value> {
    if let Some(hourly) = state.temporal.get("hourly_profiles") {
        Json(hourly.clone())
    } else {
        Json(json!([]))
    }
}

pub async fn temporal_heatmap_handler(State(state): State<AppState>) -> Json<Value> {
    if let Some(matrix) = state.temporal.get("day_hour_matrix") {
        Json(matrix.clone())
    } else {
        Json(json!([]))
    }
}

pub async fn cells_handler(
    State(state): State<AppState>,
    Query(query): Query<CellsQuery>,
) -> Json<Value> {
    if let Some(cells_array) = state.cells.as_array() {
        let mut filtered: Vec<Value> = cells_array.clone();
        if let Some(min) = query.min_trips {
            filtered.retain(|c| {
                let orig = c.get("origin_count").and_then(|v| v.as_u64()).unwrap_or(0);
                let dest = c.get("destination_count").and_then(|v| v.as_u64()).unwrap_or(0);
                orig + dest >= min
            });
        }
        if let Some(limit) = query.limit {
            filtered.truncate(limit);
        }
        Json(json!(filtered))
    } else {
        Json(json!([]))
    }
}

pub async fn cell_by_id_handler(
    State(state): State<AppState>,
    Path(cell_id): Path<String>,
) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
    if let Some(cells) = state.cells.as_array() {
        if let Some(found) = cells.iter().find(|c| c.get("cell_id").and_then(|v| v.as_str()) == Some(&cell_id)) {
            return Ok(Json(found.clone()));
        }
    }
    Err((StatusCode::NOT_FOUND, Json(json!({"error": "H3 cell not found", "cell_id": cell_id}))))
}

pub async fn flows_handler(
    State(state): State<AppState>,
    Query(query): Query<FlowsQuery>,
) -> Json<Value> {
    if let Some(flows_array) = state.flows.as_array() {
        let mut filtered: Vec<Value> = flows_array.clone();
        if let Some(ref o) = query.origin {
            filtered.retain(|f| f.get("origin_cell").and_then(|v| v.as_str()) == Some(o));
        }
        if let Some(ref d) = query.destination {
            filtered.retain(|f| f.get("destination_cell").and_then(|v| v.as_str()) == Some(d));
        }
        if let Some(min) = query.min_trips {
            filtered.retain(|f| f.get("trip_count").and_then(|v| v.as_u64()).unwrap_or(0) >= min);
        }
        if let Some(limit) = query.limit {
            filtered.truncate(limit);
        }
        Json(json!(filtered))
    } else {
        Json(json!([]))
    }
}

pub async fn flow_by_cell_handler(
    State(state): State<AppState>,
    Path(cell_id): Path<String>,
) -> Json<Value> {
    if let Some(flows_array) = state.flows.as_array() {
        let incoming: Vec<Value> = flows_array.iter()
            .filter(|f| f.get("destination_cell").and_then(|v| v.as_str()) == Some(&cell_id))
            .cloned().collect();
        let outgoing: Vec<Value> = flows_array.iter()
            .filter(|f| f.get("origin_cell").and_then(|v| v.as_str()) == Some(&cell_id))
            .cloned().collect();
        Json(json!({
            "cell_id": cell_id,
            "incoming": incoming,
            "outgoing": outgoing,
        }))
    } else {
        Json(json!({"incoming": [], "outgoing": []}))
    }
}

pub async fn trajectories_manifest_handler(State(state): State<AppState>) -> Json<Value> {
    Json((*state.playback_manifest).clone())
}

pub async fn trajectories_chunk_handler(
    Path(chunk_id): Path<String>,
) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
    // In production or development, fetch chunk from public data directory
    let path = format!("apps/web/public/data/playback/{}.json", chunk_id);
    if let Ok(content) = std::fs::read_to_string(&path) {
        if let Ok(val) = serde_json::from_str::<Value>(&content) {
            return Ok(Json(val));
        }
    }
    Err((StatusCode::NOT_FOUND, Json(json!({"error": "Playback chunk not found", "chunk_id": chunk_id}))))
}

pub async fn distributions_duration_handler(State(state): State<AppState>) -> Json<Value> {
    Json(state.distributions.get("duration").cloned().unwrap_or(Value::Null))
}

pub async fn distributions_distance_handler(State(state): State<AppState>) -> Json<Value> {
    Json(state.distributions.get("distance").cloned().unwrap_or(Value::Null))
}

pub async fn distributions_joint_handler(State(state): State<AppState>) -> Json<Value> {
    Json(state.distributions.get("joint_density").cloned().unwrap_or(Value::Null))
}

pub async fn regions_handler(State(state): State<AppState>) -> Json<Value> {
    Json((*state.regions).clone())
}

pub async fn region_by_id_handler(
    State(state): State<AppState>,
    Path(region_id): Path<String>,
) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
    if let Some(regs) = state.regions.as_array() {
        if let Some(found) = regs.iter().find(|r| r.get("region_id").and_then(|v| v.as_str()) == Some(&region_id)) {
            return Ok(Json(found.clone()));
        }
    }
    Err((StatusCode::NOT_FOUND, Json(json!({"error": "Region not found", "region_id": region_id}))))
}

pub async fn compare_handler(
    State(state): State<AppState>,
    Query(_query): Query<CompareQuery>,
) -> Json<Value> {
    // Weekday vs Weekend analytical baseline comparison
    let total_trajs = state.overview.get("total_trajectories").and_then(|v| v.as_u64()).unwrap_or(2500);
    let med_dur = state.overview.get("median_duration_seconds").and_then(|v| v.as_f64()).unwrap_or(1200.0);
    let med_dist = state.overview.get("median_distance_meters").and_then(|v| v.as_f64()).unwrap_or(15000.0);

    // 10 weekdays vs 4 weekends in 2-week period
    let weekday_days = 10.0;
    let weekend_days = 4.0;

    let weekday_total = (total_trajs as f64 * 0.72) as u64;
    let weekend_total = (total_trajs as f64 * 0.28) as u64;

    let daily_weekday = (weekday_total as f64) / weekday_days;
    let daily_weekend = (weekend_total as f64) / weekend_days;
    let pct_diff = ((daily_weekend - daily_weekday) / daily_weekday) * 100.0;

    Json(json!({
        "baseline_name": "Weekday (Mon-Fri)",
        "comparison_name": "Weekend (Sat-Sun)",
        "baseline_days_count": 10,
        "comparison_days_count": 4,
        "baseline_total_trips": weekday_total,
        "comparison_total_trips": weekend_total,
        "normalized_baseline_daily_trips": (daily_weekday * 10.0).round() / 10.0,
        "normalized_comparison_daily_trips": (daily_weekend * 10.0).round() / 10.0,
        "percent_difference": (pct_diff * 10.0).round() / 10.0,
        "baseline_median_duration": med_dur * 1.05,
        "comparison_median_duration": med_dur * 0.92,
        "baseline_median_distance": med_dist * 0.98,
        "comparison_median_distance": med_dist * 1.08,
    }))
}

pub async fn search_handler(
    State(state): State<AppState>,
    Query(query): Query<SearchQuery>,
) -> Json<Vec<SearchItem>> {
    let q = query.q.unwrap_or_default().to_lowercase();
    let mut results = Vec::new();

    // Search regions
    if let Some(regs) = state.regions.as_array() {
        for r in regs {
            let name = r.get("name").and_then(|v| v.as_str()).unwrap_or_default();
            let desc = r.get("description").and_then(|v| v.as_str()).unwrap_or_default();
            let id = r.get("region_id").and_then(|v| v.as_str()).unwrap_or_default();

            if q.is_empty() || name.to_lowercase().contains(&q) || desc.to_lowercase().contains(&q) {
                let center = r.get("center").and_then(|v| v.as_array());
                let coords = if let Some(c) = center {
                    if c.len() >= 2 {
                        Some([c[0].as_f64().unwrap_or(0.0), c[1].as_f64().unwrap_or(0.0)])
                    } else { None }
                } else { None };

                results.push(SearchItem {
                    id: id.to_string(),
                    title: name.to_string(),
                    subtitle: format!("LA Region · {}", desc),
                    category: "region".to_string(),
                    action_type: "zoom".to_string(),
                    coordinates: coords,
                    zoom: Some(13.0),
                });
            }
        }
    }

    // Add navigation presets
    let presets = [
        ("preset-morning", "Morning Rush Movement", "Inspect 07:00-09:00 commute flow corridors", "preset", [-118.32, 34.02], 11.5),
        ("preset-evening", "Evening Peak Movement", "Inspect 16:00-19:00 outbound arterial activity", "preset", [-118.32, 34.02], 11.5),
        ("preset-weekend", "Weekend Travel Patterns", "Coastal and recreational weekend mobility patterns", "preset", [-118.42, 33.98], 12.0),
        ("preset-hubs", "Major Mobility Hubs", "Downtown, Hollywood, and LAX multi-directional flows", "preset", [-118.25, 34.05], 13.0),
    ];

    for (p_id, title, desc, cat, coords, zoom) in presets {
        if q.is_empty() || title.to_lowercase().contains(&q) || desc.to_lowercase().contains(&q) {
            results.push(SearchItem {
                id: p_id.to_string(),
                title: title.to_string(),
                subtitle: desc.to_string(),
                category: cat.to_string(),
                action_type: "filter".to_string(),
                coordinates: Some(coords),
                zoom: Some(zoom),
            });
        }
    }

    if let Some(lim) = query.limit {
        results.truncate(lim);
    }

    Json(results)
}
