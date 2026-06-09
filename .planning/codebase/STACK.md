# Technology Stack

**Analysis Date:** 2026-06-09

## Languages

**Primary:**
- TypeScript (ES2023 target) - `src/index.ts`, all source under `src/`

**Secondary:**
- Not detected (no secondary language files present)

## Runtime

**Environment:**
- Node.js 24 (pinned in `.github/workflows/ci.yml` via `actions/setup-node@v4`)

**Package Manager:**
- pnpm (via corepack) - referenced in CI workflows
- Lockfile: not committed (CI uses `--no-frozen-lockfile` for standalone runs)

## Frameworks

**Core:**
- None - this is a minimal Cinatra platform extension (artifact kind), not an application framework

**Testing:**
- None detected — tests run via `pnpm test --if-present`; no test framework configured in `package.json`

**Build/Dev:**
- TypeScript compiler (`tsc`) - config at `tsconfig.json`; outputs to `dist/`

## Key Dependencies

**Critical:**
- `@cinatra-ai/sdk-extensions` - optional peer dependency; provides `SemanticArtifactManifest` type used in `src/index.ts`; resolved only within the Cinatra monorepo, never published to a public registry

## Configuration

**Environment:**
- No environment variables detected; no `.env` files present
- Package behavior is configured entirely through `package.json` `cinatra` block

**Build:**
- `tsconfig.json` - standalone strict TypeScript config targeting ES2023, ESNext modules, bundler resolution; emits to `dist/`; does not extend any base config
- `.npmrc` - sets `auto-install-peers=false`

## Platform Requirements

**Development:**
- Node.js 24+, corepack/pnpm for package management
- `@cinatra-ai/sdk-extensions` must be available via the Cinatra monorepo workspace (not a standalone-installable package)
- This repo is a **source mirror**: CI skips standalone install/typecheck/test because host-internal peers are unresolvable outside the monorepo

**Production:**
- Published to `registry.cinatra.ai` (Cinatra Marketplace) via a GitHub Release workflow (`.github/workflows/release.yml`)
- Publish uses reusable workflow `cinatra-ai/.github/.github/workflows/reusable-extension-release.yml@main` and org-level `CINATRA_MARKETPLACE_VENDOR_TOKEN` secret

---

*Stack analysis: 2026-06-09*
