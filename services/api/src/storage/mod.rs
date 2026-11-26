use serde_json::Value;
use std::sync::Arc;

pub const DEFAULT_MANIFEST: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/manifest.json");
pub const DEFAULT_OVERVIEW: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/overview.json");
pub const DEFAULT_CELLS: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/cells.json");
pub const DEFAULT_FLOWS: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/flows.json");
pub const DEFAULT_TEMPORAL: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/temporal.json");
pub const DEFAULT_DISTRIBUTIONS: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/distributions.json");
pub const DEFAULT_REGIONS: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/regions.json");
pub const DEFAULT_PLAYBACK_MANIFEST: &str =
    include_str!("../../../../data/processed/releases/rel-2019-12-v1/playback/manifest.json");

#[derive(Clone)]
pub struct AppState {
    pub manifest: Arc<Value>,
    pub overview: Arc<Value>,
    pub cells: Arc<Value>,
    pub flows: Arc<Value>,
    pub temporal: Arc<Value>,
    pub distributions: Arc<Value>,
    pub regions: Arc<Value>,
    pub playback_manifest: Arc<Value>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            manifest: Arc::new(serde_json::from_str(DEFAULT_MANIFEST).unwrap_or(Value::Null)),
            overview: Arc::new(serde_json::from_str(DEFAULT_OVERVIEW).unwrap_or(Value::Null)),
            cells: Arc::new(serde_json::from_str(DEFAULT_CELLS).unwrap_or(Value::Null)),
            flows: Arc::new(serde_json::from_str(DEFAULT_FLOWS).unwrap_or(Value::Null)),
            temporal: Arc::new(serde_json::from_str(DEFAULT_TEMPORAL).unwrap_or(Value::Null)),
            distributions: Arc::new(
                serde_json::from_str(DEFAULT_DISTRIBUTIONS).unwrap_or(Value::Null),
            ),
            regions: Arc::new(serde_json::from_str(DEFAULT_REGIONS).unwrap_or(Value::Null)),
            playback_manifest: Arc::new(
                serde_json::from_str(DEFAULT_PLAYBACK_MANIFEST).unwrap_or(Value::Null),
            ),
        }
    }
}
