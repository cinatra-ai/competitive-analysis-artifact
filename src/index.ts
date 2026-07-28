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
// there is no manifest `mode` field. This typed export mirrors that manifest IN
// FULL — the descriptor (representation forms + matcher bundle) AND the
// `objectTypes` claim block — against the SDK `SemanticArtifactManifest`
// contract, and the host pack parity suite pins the two structurally equal so
// they cannot diverge.
export const competitiveAnalysisArtifactManifest: SemanticArtifactManifest = {
  accepts: {
    file: {
      mimeTypes: ["text/markdown", "text/plain", "application/pdf"],
    },
  },
  skills: {
    matchers: [
      "@cinatra-ai/competitive-analysis-matcher-skill:competitive-analysis-matcher",
    ],
  },
  matcherConfidenceThreshold: 0.7,
  objectTypes: [
    {
      type: "@cinatra-ai/competitive-analysis-artifact:competitive-analysis",
      claim: "dedicated",
      dispositions: {
        projection: "artifact-safe",
        pinnable: true,
        snapshotPolicy: "content",
        sensitivity: "normal",
        mutability: "draftable",
      },
      schema: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          summary: {
            type: "string",
          },
          contentMarkdown: {
            type: "string",
          },
          competitors: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: true,
      },
    },
  ],
};
