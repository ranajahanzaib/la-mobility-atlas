#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "      LA Mobility Atlas - Production Build Script         "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

if [[ "$OSTYPE" == "darwin"* ]]; then
  export DEVELOPER_DIR="${DEVELOPER_DIR:-/Library/Developer/CommandLineTools}"
  export SDKROOT="${SDKROOT:-/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk}"
fi

echo "Step 1: Validating Python data pipeline & running unit tests..."
PYTHONPATH=pipelines/mobility/src python3 -m unittest discover -s pipelines/mobility/tests -p "test_*.py"

echo "Step 2: Testing and building Rust Axum API backend..."
cargo test --tests --manifest-path services/api/Cargo.toml --offline
cargo build --release --manifest-path services/api/Cargo.toml --target wasm32-unknown-unknown --lib --offline
cargo build --release --manifest-path services/api/Cargo.toml --bin la_mobility_server --offline

echo "Step 3: Building Next.js frontend application..."
pnpm --filter web build

echo "Step 4: Verifying build outputs..."
test -d "${ROOT_DIR}/apps/web/out"
test -f "${ROOT_DIR}/apps/web/out/index.html"
test -f "${ROOT_DIR}/services/api/target/wasm32-unknown-unknown/release/la_mobility_api.wasm"
test -f "${ROOT_DIR}/services/api/target/release/la_mobility_server"

echo "=========================================================="
echo "          Build completed successfully!                   "
echo "=========================================================="
