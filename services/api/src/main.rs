use std::net::SocketAddr;
use la_mobility_api::create_router;

#[tokio::main]
async fn main() {
    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8787);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let app = create_router();

    println!("=================================================");
    println!("  LA Mobility Atlas API (Rust / Axum)");
    println!("  Listening on http://localhost:{}", port);
    println!("=================================================");

    let listener = tokio::net::TcpListener::bind(addr).await.expect("Failed to bind TCP listener");
    axum::serve(listener, app).await.expect("Server error");
}
