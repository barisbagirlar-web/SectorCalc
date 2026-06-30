import type {
  DecisionEngineResolveInput,
  SectorCalcCaseState,
  ToolArchetype,
} from "@/lib/features/decision-engine/decision-engine-types";
import {
  resolveDecisionLevel,
  resolveInputCompleteness,
  resolveRiskLevel,
} from "@/lib/features/decision-engine/decision-level-resolver";
import {
  getDefaultCurrencyForRegion,
  getDefaultUnitSystemForRegion,
  isRegionalEngineCode,
  resolveRegionalCode,
} from "@/lib/features/regional/regions";
import type { RegionalEngineCode } from "@/lib/features/regional/types";

const COST_TYPE_BY_ARCHETYPE: Readonly<Partial<Record<ToolArchetype, string>>> = {
  "cost-margin": "margin-pricing",
  "production-operations": "operational-throughput",
  "energy-loss": "utility-loss",
  "finance-hr": "people-cost",
  "construction-field": "field-quantity",
  "logistics-route": "route-cost",
  "quality-lean": "quality-waste",
  "engineering-standard": "design-reference",
  "technical-measurement": "dimensional",
  generic: "general",
};

const TECHNICAL_DOMAIN_BY_ARCHETYPE: Readonly<Partial<Record<ToolArchetype, string>>> = {
  "engineering-standard": "standards-reference",
  "technical-measurement": "dimensional-geometry",
  "production-operations": "shop-floor",
  "energy-loss": "utilities",
  "construction-field": "site-quantity",
  "logistics-route": "fleet-routing",
  "quality-lean": "process-quality",
  "cost-margin": "commercial-pricing",
  "finance-hr": "workforce-economics",
  generic: "general",
};

export function buildCaseState(
  input: DecisionEngineResolveInput,
  archetypes: readonly ToolArchetype[],
): SectorCalcCaseState {
  const primary = archetypes[0] ?? "generic";
  const regionCode: RegionalEngineCode =
    input.region && isRegionalEngineCode(input.region.toUpperCase())
      ? (input.region.toUpperCase() as RegionalEngineCode)
      : resolveRegionalCode({ locale: input.locale, regionCode: undefined });
  const region = regionCode;
  const tier = input.tier ?? "free";
  const decisionLevel = resolveDecisionLevel(primary, tier, input.inputKeys);
  const riskLevel = resolveRiskLevel(primary, tier);
  const inputCompleteness = resolveInputCompleteness(input);
  const unitSystem = input.unitSystem ?? getDefaultUnitSystemForRegion(regionCode);
  const currency = input.currency ?? getDefaultCurrencyForRegion(regionCode);

  return {
    toolSlug: input.toolSlug,
    locale: input.locale,
    region,
    archetype: primary,
    decisionLevel,
    sector: input.sector,
    costType: COST_TYPE_BY_ARCHETYPE[primary],
    technicalDomain: TECHNICAL_DOMAIN_BY_ARCHETYPE[primary],
    riskLevel,
    inputCompleteness,
    unitSystem,
    currency,
    standards: primary === "engineering-standard" ? [] : undefined,
    trustTraceEnabled: tier !== "free" && riskLevel !== "low",
  };
}
