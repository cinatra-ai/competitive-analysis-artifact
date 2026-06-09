# Codebase Structure

**Analysis Date:** 2026-06-09

## Directory Layout

```
competitive-analysis-artifact/
├── src/
│   └── index.ts          # Single TypeScript export: SemanticArtifactManifest constant
├── skills/
│   └── competitive-analysis-matcher/
│       └── SKILL.md      # LLM classifier prompt for this artifact type
├── .github/
│   └── workflows/
│       ├── ci.yml        # Baseline CI: classify, typecheck, test, pack dry-run
│       └── release.yml   # Release pipeline
├── .planning/
│   └── codebase/         # GSD codebase map documents (this directory)
├── package.json          # Package identity + cinatra platform metadata
├── tsconfig.json         # Standalone TypeScript compiler config
├── .npmrc                # npm registry config
├── LICENSE               # Apache-2.0
└── README.md             # Project documentation
```

## Directory Purposes

**`src/`:**
- Purpose: TypeScript source for the artifact extension.
- Contains: One file (`index.ts`) exporting the manifest constant.
- Key files: `src/index.ts`

**`skills/`:**
- Purpose: LLM skill prompts associated with this artifact.
- Contains: One subdirectory per skill, each containing a `SKILL.md` prompt file.
- Key files: `skills/competitive-analysis-matcher/SKILL.md`

**`.github/workflows/`:**
- Purpose: CI/CD automation.
- Contains: Baseline gate (`ci.yml`) and release pipeline (`release.yml`).
- Key files: `.github/workflows/ci.yml`

**`.planning/codebase/`:**
- Purpose: GSD codebase map documents consumed by planning and execution agents.
- Generated: Yes (by `/gsd-map-codebase`).
- Committed: Yes.

## Key File Locations

**Entry Points:**
- `src/index.ts`: TypeScript export consumed by the Cinatra monorepo at artifact registration.

**Configuration:**
- `package.json`: Package identity, peer dependency declarations, and the `cinatra` metadata block (kind, artifact shape, matcher references).
- `tsconfig.json`: Standalone TypeScript compiler config; targets `src/`, emits to `dist/`.
- `.npmrc`: npm registry configuration.

**Core Logic:**
- `src/index.ts`: Manifest constant (accepted MIME types, skill references, confidence threshold).
- `skills/competitive-analysis-matcher/SKILL.md`: All classification intelligence lives here.

**CI/CD:**
- `.github/workflows/ci.yml`: Full gate logic including first-party dep shape validation, conditional install/typecheck/test, and pack dry-run.

## Naming Conventions

**Files:**
- TypeScript source files: `camelCase.ts` (e.g., `index.ts`).
- Skill prompt files: always named `SKILL.md` within a skill subdirectory.
- Workflow files: `kebab-case.yml`.

**Directories:**
- Skills: kebab-case matching the skill name registered in `package.json` (e.g., `competitive-analysis-matcher`).
- Skills directory name must match the identifier used in `cinatra.artifact.skills.matchers` after the colon: `@cinatra-ai/competitive-analysis-artifact:competitive-analysis-matcher`.

## Where to Add New Code

**New matcher skill:**
- Create `skills/<skill-name>/SKILL.md` following the frontmatter + prose + JSON-output-contract pattern of `skills/competitive-analysis-matcher/SKILL.md`.
- Register the skill in `package.json` under `cinatra.artifact.skills.matchers` and mirror the entry in `src/index.ts` manifest.

**New TypeScript utility:**
- Place in `src/` alongside `index.ts`. Export from `index.ts` if platform-consumed.
- Do not add runtime logic unrelated to manifest declaration.

**Additional CI gates:**
- Append steps to the `kind-gates` job in `.github/workflows/ci.yml` following the pattern described in its header comment.

## Special Directories

**`dist/`:**
- Purpose: TypeScript compiler output (`tsc` target per `tsconfig.json`).
- Generated: Yes (by `tsc`).
- Committed: No (not present; generated at build time in the monorepo).

**`node_modules/`:**
- Purpose: Runtime dependencies.
- Generated: Yes (by pnpm).
- Committed: No. No lockfile is committed; CI uses `--no-frozen-lockfile` for standalone repos.

---

*Structure analysis: 2026-06-09*
