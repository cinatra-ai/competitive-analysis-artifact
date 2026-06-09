# Testing Patterns

**Analysis Date:** 2026-06-09

## Test Framework

**Runner:** Not detected — no test framework is installed or configured in this repo.

**Config files:** None (`jest.config.*`, `vitest.config.*`, etc. are absent).

**Run Commands:**
```bash
# CI runs: corepack pnpm test --if-present
# Because this is a source mirror (has @cinatra-ai/* optional peers),
# CI skips standalone tests entirely. The cinatra monorepo runs tests.
```

## Test File Organization

**Location:** No test files exist in this repository.

**Reason:** This is a Cinatra source mirror artifact extension. Per the CI workflow (`.github/workflows/ci.yml`), repos that declare host-internal `@cinatra-ai/*` optional peer dependencies are classified as source mirrors. Their install, typecheck, and test steps are all skipped in standalone CI. The cinatra monorepo owns test execution for these packages.

## Test Structure

Not applicable — no test files are present.

## Mocking

Not applicable — no test files are present.

## Fixtures and Factories

Not applicable — no test files are present.

## Coverage

**Requirements:** Not enforced at the standalone repo level. The monorepo controls coverage thresholds.

## Test Types

**Unit Tests:** Not present in this repo.

**Integration Tests:** Not present in this repo.

**E2E Tests:** Not applicable.

## CI Gate (Substitute for Tests)

While no unit tests exist, the CI pipeline (`.github/workflows/ci.yml`) enforces the following quality gates:

**Dependency shape validation (build job — "Classify repo" step):**
- Fails with exit 2 if any `@cinatra-ai/*` or `@cinatra/*` package appears in `dependencies`, `devDependencies`, or `optionalDependencies`
- Fails if a first-party peer is not marked `peerDependenciesMeta[pkg].optional = true`
- Implemented as an inline `node -e` script — no external tooling required

**Pack dry-run (`npm pack --dry-run`):**
- Validates package shape and publish payload
- Catches missing fields, invalid `main`/`types` pointers, unexpected files

**Kind-gates job:**
- Runs after `build` job
- For `artifact` kind: no extra gate currently (documented as a placeholder for future kind-specific checks)

## What to Add When Writing Tests

If the cinatra monorepo adds tests for this package, they should follow these conventions implied by the CI setup:

- Place test files alongside source: `src/index.test.ts`
- Use `pnpm test` as the run command (hoisted from `package.json` scripts)
- The manifest export (`competitiveAnalysisArtifactManifest` in `src/index.ts`) is the only testable unit — verify its shape matches `package.json`'s `cinatra.artifact` block
- Confidence threshold (`matcherConfidenceThreshold: 0.7`) should be tested as a constant boundary

---

*Testing analysis: 2026-06-09*
