use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use tower::ServiceExt; // for `oneshot`
use la_mobility_api::create_router;

#[tokio::test]
async fn test_health_endpoint() {
    let app = create_router();
    let response = app
        .oneshot(Request::builder().uri("/api/v1/health").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_manifest_endpoint() {
    let app = create_router();
    let response = app
        .oneshot(Request::builder().uri("/api/v1/manifest").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_overview_endpoint() {
    let app = create_router();
    let response = app
        .oneshot(Request::builder().uri("/api/v1/overview").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_cells_endpoint() {
    let app = create_router();
    let response = app
        .oneshot(Request::builder().uri("/api/v1/cells").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_regions_endpoint() {
    let app = create_router();
    let response = app
        .oneshot(Request::builder().uri("/api/v1/regions").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_search_endpoint() {
    let app = create_router();
    let response = app
        .oneshot(Request::builder().uri("/api/v1/search?q=Downtown").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}
