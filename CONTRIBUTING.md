# Contributing to LA Mobility Atlas

Thank you for your interest in contributing to **LA Mobility Atlas**! As an open-source scientific intelligence platform, we welcome contributions including bug fixes, feature enhancements, documentation improvements, and performance optimizations.

---

## 1. Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all community members with respect and professionalism.

---

## 2. Scientific & Ethical Guidelines

Contributors must review and uphold the core research principles specified in [`AGENTS.md`](AGENTS.md):

- **Synthetic Data Integrity**: Under no circumstances should copy or analytical narratives present the synthetic DDTG trajectory dataset as real-time GPS telemetry, personal travel diaries, or official toll records.
- **Non-Inference**: Do not extrapolate commuter identity, personal residential locations, income, or demographic traits from trajectory endpoints.
- **Geographic Bounding Box**: Los Angeles metropolitan coverage is bounded by:
  - North: `34.335035° N`
  - South: `33.699820° N`
  - West: `-118.667665° W`
  - East: `-118.180532° W`

---

## 3. Development Workflow

### Prerequisites

- **Node.js**: v20 or higher
- **pnpm**: v9 or higher
- **Rust**: 1.75+ (with `wasm32-unknown-unknown` target)
- **Python**: 3.11+

### Fork and Clone

```bash
git clone https://github.com/ranajahanzaib/la-mobility-atlas.git
cd la-mobility-atlas
pnpm install
```

### Creating a Branch

Create a descriptive branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

---

## 4. Testing Protocols

Before submitting a pull request, ensure all validation tests pass across the monorepo:

### 1. Python Data Pipeline Tests

```bash
PYTHONPATH=pipelines/mobility/src python3 -m unittest discover -s pipelines/mobility/tests -p "test_*.py"
```

### 2. Rust Backend API Integration Tests

```bash
cargo test --tests --manifest-path services/api/Cargo.toml
```

### 3. Frontend Static Build Verification

```bash
pnpm --filter @la-mobility-atlas/web build
```

### 4. End-to-End Build Script

You can run the full automated verification script:

```bash
./scripts/build.sh
```

---

## 5. Submitting a Pull Request

1. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of `ranajahanzaib/la-mobility-atlas`.
3. Provide a clear description of the problem solved, changes made, and test coverage added.
4. Reference any relevant issue numbers using GitHub keywords (e.g., `Fixes #12`).
