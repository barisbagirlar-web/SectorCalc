import type {
  DecisionEngineResolveInput,
  DecisionLevel,
  InputCompleteness,
  RiskLevel,
  ToolArchetype,
} from "@/lib/decision-engine/decision-engine-types";

const HIGH_RISK_ARCHETYPES = new Set<ToolArchetype>([
  "engineering-standard",
  "finance-hr",
]);

const CASE_STUDY_ARCHETYPES = new Set<ToolArchetype>([
  "cost-margin",
  "production-operations",
  "energy-loss",
  "logistics-route",
]);

export function resolveInputCompleteness(input: DecisionEngineResolveInput): InputCompleteness {
  const filled = input.filledInputCount ?? 0;
  const total = input.totalInputCount ?? input.inputKeys?.length ?? 0;
  if (total === 0) {
    return "minimal";
  }
  const ratio = filled / total;
  if (ratio >= 0.85) {
    return "advanced";
  }
  if (ratio >= 0.45) {
    return "sufficient";
  }
  return "minimal";
}

export function resolveRiskLevel(
  archetype: ToolArchetype,
  tier: DecisionEngineResolveInput["tier"],
): RiskLevel {
  if (HIGH_RISK_ARCHETYPES.has(archetype)) {
    return "high";
  }
  if (tier === "premium" || tier === "premium-schema") {
    return archetype === "cost-margin" || archetype === "production-operations" ? "medium" : "low";
  }
  return archetype === "generic" ? "low" : "medium";
}

export function resolveDecisionLevel(
  archetype: ToolArchetype,
  tier: DecisionEngineResolveInput["tier"],
  inputKeys: readonly string[] | undefined,
): DecisionLevel {
  const slugHaystack = (inputKeys ?? []).join(" ").toLowerCase();

  if (archetype === "engineering-standard" || /pressure|vessel|structural|welding|asme|ped/i.test(slugHaystack)) {
    return "engineering-review";
  }

  if (archetype === "finance-hr" || /payroll|tax|compliance|benefit|kvkk|gdpr/i.test(slugHaystack)) {
    return "compliance-sensitive";
  }

  if (tier === "premium" || tier === "premium-schema") {
    if (CASE_STUDY_ARCHETYPES.has(archetype)) {
      return "case-study";
    }
    return "standard";
  }

  if (archetype === "technical-measurement" || archetype === "construction-field") {
    return "quick";
  }

  return "standard";
}
