import {
  validateConstructionSubcontractorMarginLeakInputs,
  type ConstructionSubcontractorMarginLeakInputs,
} from "@/lib/premium-schema/calculators/construction-subcontractor-margin-leak-validation";

export type { ConstructionSubcontractorMarginLeakInputs };

export type ConstructionSubcontractorMarginLeakSummaryLevel = "low" | "warning" | "critical";

export type ConstructionSubcontractorMarginLeakPrimaryDriver = "marginPressure";

export type ConstructionSubcontractorMarginLeakResult = {
  subcontractorVariance: number;
  totalExposure: number;
  marginPressure: number;
  summaryLevel: ConstructionSubcontractorMarginLeakSummaryLevel;
  primaryDriver: ConstructionSubcontractorMarginLeakPrimaryDriver;
  decisionVerdict: {
    summaryLevel: ConstructionSubcontractorMarginLeakSummaryLevel;
    primaryDriver: ConstructionSubcontractorMarginLeakPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const MARGIN_PRESSURE_WARNING_THRESHOLD = 3;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 7;

function resolveSummaryLevel(marginPressure: number): ConstructionSubcontractorMarginLeakSummaryLevel {
  if (marginPressure >= MARGIN_PRESSURE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (marginPressure >= MARGIN_PRESSURE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(
  summaryLevel: ConstructionSubcontractorMarginLeakSummaryLevel,
): string {
  if (summaryLevel === "low") {
    return "Subcontractor margin pressure is below the warning band. Continue monitoring variance, delay claims and material drift.";
  }
  if (summaryLevel === "warning") {
    return "Subcontractor leak is pressuring project margin. Audit change orders, delay claims and material variance before closeout.";
  }
  return "Critical margin leak detected. Renegotiate subs or reprice before accepting similar contract scope.";
}

export function calculateConstructionSubcontractorMarginLeak(
  inputs: ConstructionSubcontractorMarginLeakInputs,
): ConstructionSubcontractorMarginLeakResult {
  const validation = validateConstructionSubcontractorMarginLeakInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const subcontractorVariance = Math.max(
    inputs.actualSubcontractorCost - inputs.plannedSubcontractorCost,
    0,
  );
  const totalExposure = subcontractorVariance + inputs.delayCost + inputs.materialVariance;
  const marginPressure = (totalExposure / inputs.contractValue) * 100;
  const summaryLevel = resolveSummaryLevel(marginPressure);
  const primaryDriver: ConstructionSubcontractorMarginLeakPrimaryDriver = "marginPressure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    subcontractorVariance,
    totalExposure,
    marginPressure,
    summaryLevel,
    primaryDriver,
    decisionVerdict: {
      summaryLevel,
      primaryDriver,
      message,
    },
    warnings: [...validation.warnings],
  };
}
