# Verification and Testing Strategy

This document outlines the multi-tiered testing suite, static validation, and verification guarantees implemented across the LA Mobility Atlas.

---

## 1. Testing Pyramid

The project maintains comprehensive test coverage across all layers of the monorepo:

```
                  ┌────────────────────────┐
                  │ Next.js Prerender / E2E │ (apps/web build)
                  ├────────────────────────┤
                  │ Rust Integration Tests │ (services/api/tests)
                  ├────────────────────────┤
                  │ Python Pipeline Tests  │ (pipelines/mobility/tests)
                  ├────────────────────────┤
                  │ TypeScript Type Checks │ (packages/*, apps/web)
                  └────────────────────────┘
```

---

## 2. Python Data Engineering Tests (`pipelines/mobility/tests/`)

Tested using Python's standard `unittest` / `pytest` runner:
- `test_h3_grid.py`:
  - Verifies exact coordinates for known Los Angeles landmarks (City Hall, Hollywood Bowl).
  - Tests hexagonal boundary generation and vertex counts (exactly 7 coordinate pairs forming closed rings).
  - Tests spatial containment and resolution scaling (Res 6, 7, 8).
- `test_validator.py`:
  - Bounding box rejection: asserts coordinates outside $[33.69982, 34.335035] \times [-118.667665, -118.180532]$ are flagged.
  - Duration consistency: verifies flag triggers when observed duration differs from reported duration by $> 300\,\text{s}$.
  - Null check verification on mandatory identifier fields (`uuid`, `tuid`, `timestamp`).
- `test_timezones.py`:
  - Validates Pacific Standard Time (`America/Los_Angeles`, UTC-8) conversion.
  - Verifies hourly binning across diurnal day boundaries.
- `test_aggregator.py`:
  - Verifies trip origin and destination counts match raw input counts exactly.
  - Verifies conservation of mass: $\sum O(c) = \sum A(c) = N_{\text{trips}}$.
- `test_trajectories.py`:
  - Verifies RDP simplification preserves endpoints and reduces intermediate vertex counts.
  - Validates 24-hour relative timestamp offsets.

**Execution**:
```bash
python3 -m unittest discover -s pipelines/mobility/tests -p "test_*.py"
```

---

## 3. Rust Backend API Tests (`services/api/tests/`)

Tested using `cargo test --tests --offline`:
- `test_health_endpoint`: Verifies `200 OK` and JSON response schema containing version and engine info.
- `test_metadata_endpoint`: Asserts correct bounding box limits and temporal bounds.
- `test_cells_endpoint`: Verifies cell retrieval, pagination, and metric fields.
- `test_flows_endpoint`: Verifies OD flow counts, volume sorting, and non-empty flow arrays.
- `test_hourly_endpoint`: Confirms exactly 24 hours are returned and sum of hourly trips equals total dataset volume.
- `test_cors_headers`: Validates `Access-Control-Allow-Origin: *` headers on API responses.

**Execution**:
```bash
cargo test --tests --manifest-path services/api/Cargo.toml --offline
```

---

## 4. Frontend Type Checking & Prerendering

The Next.js web application enforces strict TypeScript checks and validates prerendering for all 12 analytical routes:
- Zero implicit `any` errors.
- Prerendering of `/`, `/explore`, `/flows`, `/trajectories`, `/density`, `/temporal`, `/compare`, `/regions`, `/distribution`, `/data`, `/methodology`, `/about`.
- Verification of static asset exports in `apps/web/out/`.

**Execution**:
```bash
pnpm --filter web build
```
