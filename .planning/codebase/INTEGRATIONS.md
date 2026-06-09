# External Integrations

**Analysis Date:** 2026-06-09

## APIs & External Services

**Cinatra Platform:**
- Cinatra Marketplace / registry (`registry.cinatra.ai`) - target for publishing this artifact extension on GitHub Release
  - SDK/Client: `@cinatra-ai/sdk-extensions` (optional peer, monorepo-internal)
  - Auth: `CINATRA_MARKETPLACE_VENDOR_TOKEN` org secret (used only in release CI; never in source code)

**GitHub Actions reusable workflow:**
- `cinatra-ai/.github/.github/workflows/reusable-extension-release.yml@main` - centralized build/pack/gate/submit pipeline called by `.github/workflows/release.yml`

## Data Storage

**Databases:**
- Not applicable — this is a static artifact manifest extension with no runtime data layer

**File Storage:**
- Not applicable

**Caching:**
- Not applicable

## Authentication & Identity

**Auth Provider:**
- Not applicable in source — auth is handled at the Cinatra Marketplace submission layer via org-level GitHub secret (`CINATRA_MARKETPLACE_VENDOR_TOKEN`)

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Not applicable — no runtime process

## CI/CD & Deployment

**Hosting:**
- Cinatra Marketplace (`registry.cinatra.ai`)

**CI Pipeline:**
- GitHub Actions
  - `.github/workflows/ci.yml` - runs on push/PR to `main`; validates package dependency shape, conditionally runs install/typecheck/test/pack dry-run based on whether the repo is a source mirror or standalone
  - `.github/workflows/release.yml` - triggers on published GitHub Release or manual `workflow_dispatch` against a version tag; delegates to the org-level reusable release workflow with `id-token: write` and `attestations: write` permissions for build provenance

## Environment Configuration

**Required env vars:**
- None required at development or runtime
- `CINATRA_MARKETPLACE_VENDOR_TOKEN` — org-level GitHub secret, required only during release CI; not present in source

**Secrets location:**
- GitHub org-level secrets (not committed); no `.env` files present in repo

## Webhooks & Callbacks

**Incoming:**
- Not applicable

**Outgoing:**
- Not applicable — release submission is handled by the org reusable workflow, not direct webhook calls from this repo

## Artifact Intake

**Accepted file types (via Cinatra platform routing):**
- `text/markdown`
- `text/plain`
- `application/pdf`

These MIME types are declared in `package.json` (`cinatra.artifact.accepts.file.mimeTypes`) and mirrored in `src/index.ts` (`competitiveAnalysisArtifactManifest`). The Cinatra platform routes uploaded files to this artifact extension based on these types plus the matcher skill result.

## Matcher Skill

**Skill:** `@cinatra-ai/competitive-analysis-artifact:competitive-analysis-matcher`
- Definition: `skills/competitive-analysis-matcher/SKILL.md`
- Purpose: LLM-based semantic classifier; determines whether an attached resource is a Competitive Analysis document
- Confidence threshold: `0.7` (configured in `package.json` and `src/index.ts`)
- Output contract: JSON `{ "matches": boolean, "confidence": number, "rationale": string }`

---

*Integration audit: 2026-06-09*
