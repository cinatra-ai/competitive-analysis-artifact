# Coding Conventions

**Analysis Date:** 2026-06-09

## Naming Patterns

**Files:**
- `camelCase` for TypeScript source files: `src/index.ts`
- `kebab-case` for skill directories: `skills/competitive-analysis-matcher/`
- `UPPER_SNAKE_CASE.md` for skill definition files: `skills/competitive-analysis-matcher/SKILL.md`

**Functions/Variables:**
- `camelCase` for exported constants: `competitiveAnalysisArtifactManifest` (`src/index.ts`)
- Descriptive, domain-prefixed names: `competitiveAnalysisArtifact*`

**Types:**
- PascalCase for imported types: `SemanticArtifactManifest` (`src/index.ts`)
- `type` keyword for type-only imports enforced by `verbatimModuleSyntax` in `tsconfig.json`

## Code Style

**Formatting:**
- No Prettier or ESLint config detected in the repo root. Formatting is not enforced by tooling at the standalone repo level — the cinatra monorepo owns linting for source mirrors.

**TypeScript:**
- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- `noImplicitAny: false` — relaxes one strict-mode rule explicitly
- `verbatimModuleSyntax: true` — type-only imports must use `import type`
- `isolatedModules: true` — each file must be independently transpilable
- Target: ES2023, module: ESNext, moduleResolution: bundler

## Import Organization

**Order (observed in `src/index.ts`):**
1. Type-only imports (`import type { ... } from "..."`)
2. No value imports exist — this repo exports a manifest object only

**Path Aliases:**
- None detected. No path mapping in `tsconfig.json`.

## Module Design

**Exports:**
- Single named export per entry point: `competitiveAnalysisArtifactManifest` from `src/index.ts`
- No default exports observed
- `main` and `types` in `package.json` both point to `./src/index.ts` (source mirror pattern — no build step in standalone mode)

**Barrel Files:**
- `src/index.ts` acts as the single barrel/entry-point for the package

## Package Shape

**Type:**
- ESM-only (`"type": "module"` in `package.json`)
- Artifact extension kind (`cinatra.kind: "artifact"`)

**Peer Dependencies:**
- First-party `@cinatra-ai/*` packages declared as optional peerDependencies only — never in `dependencies` or `devDependencies`. This is enforced by CI (`ci.yml` classify step).

## Comments

**When to Comment:**
- Block comments explain architectural decisions: why the manifest shape is bytes-only, what this artifact is and is NOT (see `src/index.ts` JSDoc block)
- CI workflow steps carry detailed explanatory comments explaining the skip/run logic

**Style:**
- Multi-line `//` block comments, not JSDoc `/** */`, for module-level documentation in `src/index.ts`

## Skill Definitions (SKILL.md)

**Format:**
- YAML front-matter: `name`, `description`
- Markdown body with explicit sections: "What it IS", "What it is NOT", "Confidence guidance", "Output contract"
- Output contract specifies exact JSON shape with types and ranges
- File: `skills/competitive-analysis-matcher/SKILL.md`

## Error Handling

**Strategy:** Not applicable — the repo contains no runtime logic, only a manifest constant and a skill prompt. Error handling is the responsibility of the cinatra SDK consumer.

## Logging

**Framework:** Not applicable — no runtime logic in this repo.

---

*Convention analysis: 2026-06-09*
