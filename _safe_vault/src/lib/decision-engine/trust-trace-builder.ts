import type { SectorCalcCaseState } from "@/lib/decision-engine/decision-engine-types";

export type TrustTraceGovernanceHints = {
  readonly enabled: boolean;
  readonly defaultExpanded: boolean;
  readonly showFormulaSteps: boolean;
  readonly showStandardSelection: boolean;
  readonly showUnitConversion: boolean;
  readonly showScenarioComparison: boolean;
};

export function buildTrustTraceGovernance(caseState: SectorCalcCaseState): TrustTraceGovernanceHints {
  const highDepth =
    caseState.decisionLevel === "engineering-review" ||
    caseState.decisionLevel === "compliance-sensitive" ||
    caseState.decisionLevel === "case-study";

  return {
    enabled: caseState.trustTraceEnabled,
    defaultExpanded: false,
    showFormulaSteps: caseState.trustTraceEnabled,
    showStandardSelection: caseState.archetype === "engineering-standard",
    showUnitConversion: caseState.unitSystem === "mixed" || caseState.archetype === "technical-measurement",
    showScenarioComparison: highDepth && caseState.riskLevel !== "low",
  };
}
