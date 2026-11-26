use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthResponse {
    pub status: &'static str,
    pub service: &'static str,
    pub version: &'static str,
    pub runtime: &'static str,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
    pub code: u16,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchQuery {
    pub q: Option<String>,
    pub limit: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchItem {
    pub id: String,
    pub title: String,
    pub subtitle: String,
    pub category: String,
    pub action_type: String,
    pub coordinates: Option<[f64; 2]>,
    pub zoom: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CellsQuery {
    pub resolution: Option<u8>,
    pub min_trips: Option<u64>,
    pub limit: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlowsQuery {
    pub origin: Option<String>,
    pub destination: Option<String>,
    pub min_trips: Option<u64>,
    pub limit: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompareQuery {
    pub baseline: Option<String>,
    pub comparison: Option<String>,
}
