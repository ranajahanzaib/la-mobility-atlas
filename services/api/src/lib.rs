pub mod models;
pub mod routes;
pub mod storage;

use axum::{routing::get, Router};
use storage::AppState;
use tower_http::cors::{Any, CorsLayer};

pub fn create_router() -> Router {
    let state = AppState::default();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/api/v1/health", get(routes::health_handler))
        .route("/api/v1/manifest", get(routes::manifest_handler))
        .route("/api/v1/overview", get(routes::overview_handler))
        .route(
            "/api/v1/temporal/profile",
            get(routes::temporal_profile_handler),
        )
        .route(
            "/api/v1/temporal/heatmap",
            get(routes::temporal_heatmap_handler),
        )
        .route("/api/v1/cells", get(routes::cells_handler))
        .route("/api/v1/cells/:cell_id", get(routes::cell_by_id_handler))
        .route("/api/v1/flows", get(routes::flows_handler))
        .route("/api/v1/flows/:cell_id", get(routes::flow_by_cell_handler))
        .route(
            "/api/v1/trajectories/manifest",
            get(routes::trajectories_manifest_handler),
        )
        .route(
            "/api/v1/trajectories/chunks/:chunk_id",
            get(routes::trajectories_chunk_handler),
        )
        .route(
            "/api/v1/distributions/duration",
            get(routes::distributions_duration_handler),
        )
        .route(
            "/api/v1/distributions/distance",
            get(routes::distributions_distance_handler),
        )
        .route(
            "/api/v1/distributions/joint",
            get(routes::distributions_joint_handler),
        )
        .route("/api/v1/regions", get(routes::regions_handler))
        .route(
            "/api/v1/regions/:region_id",
            get(routes::region_by_id_handler),
        )
        .route("/api/v1/compare", get(routes::compare_handler))
        .route("/api/v1/search", get(routes::search_handler))
        .layer(cors)
        .with_state(state)
}
