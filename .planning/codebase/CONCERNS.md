# Codebase Concerns

**Analysis Date:** 2026-06-09

## Tech Debt

**No lockfile committed:**
- Issue: `package.json` declares `peerDependencies` but there is no `pnpm-lock.yaml` or `package-lock.json`. CI explicitly uses `--no-frozen-lockfile`, meaning dependency resolution is non-deterministic across runs.
- Files: `package.json`, `.github/workflows/ci.yml` (line 81)
- Impact: Builds may silently resolve different transitive dependency versions over time; reproducibility is not guaranteed.
- Fix approach: Commit a lockfile (or document intentionally lockfile-free as a policy decision for source-mirror repos).

**`strict: true` partially undermined by `noImplicitAny: false`:**
- Issue: `tsconfig.json` enables `strict` (which implies `noImplicitAny`) but then explicitly overrides `noImplicitAny` to `false`, creating an inconsistency that permits untyped code.
- Files: `tsconfig.json`
- Impact: Future contributors can introduce untyped parameters/variables without a compile-time error, eroding type safety over time.
- Fix approach: Remove the `noImplicitAny: false` override to honour the full `strict` mode, or document the deliberate relaxation.

**`main` and `types` fields point to raw TypeScript source:**
- Issue: `package.json` sets `"main": "./src/index.ts"` and `"types": "./src/index.ts"`. These point to source, not compiled output (`dist/`). Consumers that resolve the package outside the monorepo workspace will receive uncompiled TypeScript.
- Files: `package.json`
- Impact: The package is not usable as a standalone npm-published artifact without a build step; mismatch with `tsconfig.json` `outDir: "dist"`.
- Fix approach: Change `main` → `./dist/index.js` and `types` → `./dist/index.d.ts`, and add a `build` script to `package.json`.

**No `scripts` section in `package.json`:**
- Issue: `package.json` has no `scripts` block (no `build`, `typecheck`, `test`, or `prepublishOnly`). CI branches on `scripts.typecheck` presence to decide how to run type checks; its absence means CI falls through to an ephemeral `npx tsc` call.
- Files: `package.json`, `.github/workflows/ci.yml` (lines 103–112)
- Impact: CI type-checking path is fragile and slower than a locally-resolved `tsc`; no reproducible build entrypoint for contributors.
- Fix approach: Add `"scripts": { "build": "tsc", "typecheck": "tsc --noEmit" }` to `package.json`.

## Known Bugs

**CI typecheck skipped for this repo (source-mirror branch):**
- Symptoms: Because `@cinatra-ai/sdk-extensions` is an optional peer, CI sets `first_party=1` and skips install, typecheck, and test entirely in the standalone CI run.
- Files: `.github/workflows/ci.yml` (lines 66–123)
- Trigger: Every push/PR — the peer detection always resolves to `first_party=1` for this repo.
- Workaround: Type correctness is only validated inside the cinatra monorepo; errors in `src/index.ts` will not be caught by standalone CI.

## Security Considerations

**`secrets: inherit` in release workflow:**
- Risk: The reusable release workflow receives all org-level secrets (`CINATRA_MARKETPLACE_VENDOR_TOKEN` and anything else in the org) via `secrets: inherit`. If the reusable workflow at `cinatra-ai/.github` is ever compromised or its `@main` ref is force-pushed, all secrets become accessible to the attacker's code.
- Files: `.github/workflows/release.yml` (line 30)
- Current mitigation: The reusable workflow is pinned to `@main` (branch ref, not a commit SHA), so integrity depends entirely on upstream branch protection.
- Recommendations: Pin the reusable workflow call to a specific commit SHA rather than `@main` to prevent supply-chain drift; apply branch-protection rules to `cinatra-ai/.github` main branch.

**`.npmrc` committed with `auto-install-peers=false`:**
- Risk: Low — this setting is non-sensitive, but committing `.npmrc` is a pattern that can later inadvertently capture registry auth tokens if a contributor adds `//registry.../` auth lines to the same file.
- Files: `.npmrc`
- Current mitigation: Current contents are non-sensitive.
- Recommendations: Add a lint check or pre-commit hook to prevent auth tokens from appearing in `.npmrc`.

## Performance Bottlenecks

**Not applicable** — this is a manifest/classifier extension with a single 24-line TypeScript file. No runtime execution paths or performance-sensitive code paths exist in this repo.

## Fragile Areas

**`matcherConfidenceThreshold: 0.7` hardcoded in two places:**
- Files: `src/index.ts` (line 23), `package.json` (line 35 — `cinatra.artifact.matcherConfidenceThreshold`)
- Why fragile: The threshold is duplicated; updating one location without the other will create a discrepancy between the TypeScript export consumed by the monorepo and the `package.json` manifest consumed by the Cinatra registry/tooling.
- Safe modification: Always update both locations simultaneously and verify with a grep before committing.
- Test coverage: No tests exist to assert that both values are in sync.

**`skills.matchers` reference uses string literal with package name:**
- Files: `src/index.ts` (line 21), `package.json` (line 32)
- Why fragile: The matcher reference `"@cinatra-ai/competitive-analysis-artifact:competitive-analysis-matcher"` is a bare string that must exactly match the package name. If the package is renamed or the skill directory is renamed, this string will silently become a broken reference with no compile-time check.
- Safe modification: Keep skill directory name (`skills/competitive-analysis-matcher`) in sync with the string literal.
- Test coverage: None.

## Scaling Limits

**Not applicable** — this extension defines a semantic classifier manifest and a prompt-based skill. It has no data processing, storage, or throughput concerns of its own.

## Dependencies at Risk

**`@cinatra-ai/sdk-extensions` pinned to `*` (wildcard):**
- Risk: The peer dependency version is `"*"`, meaning any version satisfies it. Breaking changes in the SDK will not be caught by version constraints.
- Impact: Manifest shape changes in `SemanticArtifactManifest` (e.g., renamed fields) would silently compile against the wrong type signature if the monorepo upgrades to an incompatible SDK version.
- Migration plan: Pin to a semver range (e.g., `">=0.1.0 <2.0.0"`) once the SDK reaches a stable release.

## Missing Critical Features

**No automated test for the SKILL.md classifier prompt:**
- Problem: `skills/competitive-analysis-matcher/SKILL.md` contains a detailed classification prompt with boundary conditions (e.g., sales-playbook vs. competitive-analysis disambiguation, confidence bands), but there are zero automated tests validating the classifier's output against known fixtures.
- Blocks: Confidence that prompt edits do not regress classification accuracy; safe iteration on boundary cases.

**No build script / compiled output:**
- Problem: The repo has no build step, no `dist/` output, and `package.json` points `main`/`types` at raw TypeScript. The package cannot be published to an npm registry in a usable state without manual intervention.
- Blocks: Any consumer outside the cinatra monorepo from importing the package; marketplace publication via the release workflow would publish uncompiled source.

## Test Coverage Gaps

**No tests at all:**
- What's not tested: The manifest object exported from `src/index.ts` (field values, structure), the confidence threshold value, skill matcher reference string correctness, and SKILL.md prompt boundary conditions.
- Files: `src/index.ts`, `skills/competitive-analysis-matcher/SKILL.md`
- Risk: Threshold or matcher reference typos, manifest field regressions, or prompt boundary drift go undetected until runtime failures in the monorepo or production classification errors.
- Priority: Medium — the surface area is small, but the SKILL.md boundary conditions are non-trivial and prone to quiet regression.

---

*Concerns audit: 2026-06-09*
