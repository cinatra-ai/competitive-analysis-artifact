<!-- refreshed: 2026-06-09 -->
# Architecture

**Analysis Date:** 2026-06-09

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│              Cinatra Monorepo / Host Platform                │
│  (resolves @cinatra-ai/sdk-extensions peer at build time)   │
└──────────────────────────┬──────────────────────────────────┘
                           │ optional peerDependency
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         competitive-analysis-artifact (this repo)            │
│                                                              │
│  src/index.ts  ─── exports SemanticArtifactManifest ───►    │
│                     {accepts, skills{matchers}, threshold}   │
└──────────────────────────┬──────────────────────────────────┘
                           │ references skill by name
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  skills/competitive-analysis-matcher/SKILL.md                │
│  (LLM prompt: classifies a document as competitive analysis) │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Artifact manifest | Declares accepted MIME types, linked matcher skill, and confidence threshold | `src/index.ts` |
| Matcher skill | LLM prompt that classifies a document as a competitive-analysis artifact (returns `matches`, `confidence`, `rationale`) | `skills/competitive-analysis-matcher/SKILL.md` |
| Package metadata | Cinatra platform registration (`cinatra.kind = artifact`), peerDependency wiring | `package.json` |
| TypeScript config | Standalone strict compiler config; compiles `src/` → `dist/` | `tsconfig.json` |
| CI pipeline | Baseline build/typecheck/test gate + kind-specific gates | `.github/workflows/ci.yml` |

## Pattern Overview

**Overall:** Cinatra Semantic Artifact Extension — a "source mirror" package that registers a semantic artifact type with the platform via a typed manifest constant plus an LLM-backed matcher skill.

**Key Characteristics:**
- Zero runtime logic — the only TypeScript export is a pure data constant (`competitiveAnalysisArtifactManifest`).
- Classification is entirely LLM-driven: the platform invokes the matcher skill (a structured prompt in `SKILL.md`) and accepts matches above `matcherConfidenceThreshold: 0.7`.
- First-party SDK types (`SemanticArtifactManifest`) are consumed as optional peerDependencies; the monorepo provides them at build time. This repo is not standalone-installable.

## Layers

**Manifest Layer:**
- Purpose: Statically describe what file types this artifact accepts and which matcher skill identifies it.
- Location: `src/index.ts`
- Contains: One exported `const` typed `SemanticArtifactManifest`.
- Depends on: `@cinatra-ai/sdk-extensions` (type only, optional peer).
- Used by: Cinatra platform at artifact-registration time.

**Skill Layer:**
- Purpose: LLM classification prompt evaluated at document-upload time by the platform's skill runner.
- Location: `skills/competitive-analysis-matcher/SKILL.md`
- Contains: Frontmatter metadata (`name`, `description`) + structured prompt defining what IS and IS NOT a competitive analysis, confidence bands, and a JSON output contract.
- Depends on: Nothing (plain Markdown prompt, interpreted by the platform LLM runtime).
- Used by: Platform skill runner referenced via `@cinatra-ai/competitive-analysis-artifact:competitive-analysis-matcher`.

## Data Flow

### Document Classification Path

1. User uploads a file (Markdown, plain text, or PDF) to the Cinatra platform.
2. Platform checks `accepts.file.mimeTypes` from the manifest in `src/index.ts` to determine eligibility.
3. Platform invokes the matcher skill (`skills/competitive-analysis-matcher/SKILL.md`) with the document content.
4. LLM returns `{ matches: boolean, confidence: number, rationale: string }`.
5. Platform compares `confidence` against `matcherConfidenceThreshold: 0.7`; if met and `matches: true`, the document is classified as a `competitive-analysis-artifact`.

**State Management:**
- No runtime state. The manifest is a static export; classification state is owned entirely by the platform.

## Key Abstractions

**SemanticArtifactManifest:**
- Purpose: SDK type that describes an artifact's accepted input formats, associated skills, and confidence threshold.
- Examples: `src/index.ts`
- Pattern: Exported constant, not a class or function.

**SKILL.md Prompt Contract:**
- Purpose: Structured Markdown prompt defining classifier behavior and output schema.
- Examples: `skills/competitive-analysis-matcher/SKILL.md`
- Pattern: YAML frontmatter (name/description) + freeform instructional prose + explicit JSON output contract block.

## Entry Points

**TypeScript export:**
- Location: `src/index.ts`
- Triggers: Imported by the Cinatra monorepo workspace at registration time.
- Responsibilities: Provides the typed artifact manifest constant.

**Skill entry:**
- Location: `skills/competitive-analysis-matcher/SKILL.md`
- Triggers: Invoked by platform skill runner when a file is uploaded and eligibility pre-check passes.
- Responsibilities: LLM-based binary classification with confidence score.

## Architectural Constraints

- **Standalone installability:** This repo declares `@cinatra-ai/sdk-extensions` as an optional peer. It cannot be installed, typechecked, or tested outside the Cinatra monorepo. CI explicitly skips install/typecheck/test for source-mirror repos.
- **Global state:** None. Single exported constant.
- **Circular imports:** None (single source file, no internal imports).
- **Output shape:** Matcher must return valid JSON exactly matching `{ "matches": boolean, "confidence": number, "rationale": string }`. No markdown wrapper allowed.
- **Confidence threshold:** Hard-coded at `0.7`; documents below this threshold are not classified as this artifact type regardless of `matches`.

## Anti-Patterns

### Promoting first-party deps out of peerDependencies

**What happens:** Moving `@cinatra-ai/sdk-extensions` from `peerDependencies` to `dependencies` or `devDependencies`.
**Why it's wrong:** These packages exist only in the Cinatra monorepo registry. CI enforces this with an explicit shape gate (exits 2 on violation).
**Do this instead:** Keep all `@cinatra-ai/*` packages as `peerDependencies` with `peerDependenciesMeta[pkg].optional = true`.

### Adding runtime logic to src/index.ts

**What happens:** Introducing functions, classes, or side effects alongside the manifest export.
**Why it's wrong:** This is a data-only extension. The platform consumes the manifest constant; runtime code has no execution context here.
**Do this instead:** Keep `src/index.ts` as a single exported constant. All intelligence belongs in `skills/*/SKILL.md` prompts.

## Error Handling

**Strategy:** Not applicable — no runtime code exists to handle errors.

**Patterns:**
- CI validation catches dependency-shape regressions at the gate level (`ci.yml` classify step).
- Matcher skill returns a rationale field to aid debugging of classification decisions.

## Cross-Cutting Concerns

**Logging:** Not applicable (no runtime).
**Validation:** Performed at CI time via inline Node.js scripts in `.github/workflows/ci.yml`.
**Authentication:** Not applicable.

---

*Architecture analysis: 2026-06-09*
