import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// Competitive-analysis artifact extension:
// the competitive-analysis artifact extension. A semantic work product describing
// the competitive landscape — named competitors, feature/pricing matrices,
// SWOT analyses, positioning maps, win/loss patterns at the strategic
// (not deal-level battlecard) layer. Distinct from the sales-playbook's
// competitive-battlecard subset (which is the field-sales view).
//
// Manifest shape: bytes-only matcher, no connectorRef / templates /
// agentDependencies. Mirrored in package.json `cinatra.artifact`.
//
// Per the ratified explicit-type rule (epic cinatra#1785), this extension
// DECLARES the one object type it owns —
// `@cinatra-ai/competitive-analysis-artifact:competitive-analysis` (claim
// "dedicated", draftable/artifact-safe/content, with its inline row JSON
// Schema) — as the manifest of record in
// `package.json` `cinatra.artifact.objectTypes`; the object-registry bridge
// reads it there. Auto-derivation of the type from the pack is retired and
// there is no manifest `mode` field. This typed export mirrors only the
// DESCRIPTOR half (representation forms + matcher bundle) — the SDK
// `SemanticArtifactManifest` contract the bridge type-checks the descriptor
// against; the `objectTypes` claim block is validated host-side by the objects
// manifest schema.
export const competitiveAnalysisArtifactManifest: SemanticArtifactManifest = {
  accepts: {
    file: {
      mimeTypes: ["text/markdown", "text/plain", "application/pdf"],
    },
  },
  skills: {
    matchers: [
      "@cinatra-ai/competitive-analysis-artifact:competitive-analysis-matcher",
    ],
  },
  matcherConfidenceThreshold: 0.7,
};
