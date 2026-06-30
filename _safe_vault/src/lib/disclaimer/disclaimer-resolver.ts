import type { DisclaimerResolveInput, ResolvedDisclaimer } from "@/lib/disclaimer/disclaimer-types";

const ELEVATED_ARCHETYPES = new Set(["cost-margin", "production-operations", "finance-hr"]);
const ENGINEERING_LEVELS = new Set(["engineering-review", "compliance-sensitive"]);

export function resolveDisclaimer(input: DisclaimerResolveInput): ResolvedDisclaimer {
  if (
    input.archetype === "engineering-standard" ||
    ENGINEERING_LEVELS.has(input.decisionLevel)
  ) {
    return {
      depth: "engineering",
      titleKey: "disclaimer.engineering.title",
      bodyKey: "disclaimer.engineering.body",
      showUsageAgreement: true,
    };
  }

  if (
    input.riskLevel === "high" ||
    input.decisionLevel === "compliance-sensitive" ||
    ELEVATED_ARCHETYPES.has(input.archetype)
  ) {
    return {
      depth: "elevated",
      titleKey: "disclaimer.elevated.title",
      bodyKey: "disclaimer.elevated.body",
      showUsageAgreement: true,
    };
  }

  return {
    depth: "standard",
    titleKey: "disclaimer.standard.title",
    bodyKey: "disclaimer.standard.body",
    showUsageAgreement: true,
  };
}
