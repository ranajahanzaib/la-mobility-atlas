#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "      LA Mobility Atlas - Deployment Script               "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

# Ensure build is up-to-date
"${ROOT_DIR}/scripts/build.sh"

echo "Step 5: Deploying to Cloudflare Workers..."
if command -v npx >/dev/null 2>&1; then
    echo "Running wrangler deploy..."
    npx wrangler deploy
else
    echo "Wrangler CLI not found. Please run 'pnpm wrangler deploy' manually."
fi

echo "Deployment complete."
