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
