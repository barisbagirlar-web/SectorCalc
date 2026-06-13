import {
  validateConstructionProjectOverrunInputs,
  type ConstructionProjectOverrunInputs,
} from "@/lib/premium-schema/calculators/construction-project-overrun-validation";

export type { ConstructionProjectOverrunInputs };

export type ConstructionProjectOverrunSummaryLevel = "low" | "warning" | "critical";

export type ConstructionProjectOverrunPrimaryDriver =
  | "delayCost"
  | "laborOverrunCost"
  | "materialOverrunCost";

export type ConstructionProjectOverrunResult = {
  delayCost: number;
  laborOverrunCost: number;
  materialOverrunCost: number;
  totalExposure: number;
  summaryLevel: ConstructionProjectOverrunSummaryLevel;
  primaryDriver: ConstructionProjectOverrunPrimaryDriver;
  decisionVerdict: {
    summaryLevel: ConstructionProjectOverrunSummaryLevel;
    primaryDriver: ConstructionProjectOverrunPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const DELAY_DAYS_WARNING_THRESHOLD = 3;
const DELAY_DAYS_CRITICAL_THRESHOLD = 10;

function resolveSummaryLevel(delayDays: number): ConstructionProjectOverrunSummaryLevel {
  if (delayDays >= DELAY_DAYS_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (delayDays >= DELAY_DAYS_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolvePrimaryDriver(
  delayCost: number,
  laborOverrunCost: number,
  materialOverrunCost: number,
): ConstructionProjectOverrunPrimaryDriver {
  if (delayCost >= laborOverrunCost && delayCost >= materialOverrunCost) {
    return "delayCost";
  }
  if (laborOverrunCost >= materialOverrunCost) {
    return "laborOverrunCost";
  }
  return "materialOverrunCost";
}

function resolveDecisionMessage(summaryLevel: ConstructionProjectOverrunSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Schedule delay exposure is below the warning band. Continue monitoring labor and material overrun assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Schedule slip is building. Review delay cost, labor drift and material variance before accepting similar change scope.";
  }
  return "Critical delay exposure detected. Reprice or resequence before accepting similar project scope.";
}

export function calculateConstructionProjectOverrun(
  inputs: ConstructionProjectOverrunInputs,
): ConstructionProjectOverrunResult {
  const validation = validateConstructionProjectOverrunInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const delayCost = inputs.dailySiteCost * inputs.delayDays;
  const laborOverrunCost = inputs.laborBudget * (inputs.laborOverrunPercent / 100);
  const materialOverrunCost = inputs.materialBudget * (inputs.materialOverrunPercent / 100);
  const totalExposure = delayCost + laborOverrunCost + materialOverrunCost;
  const summaryLevel = resolveSummaryLevel(inputs.delayDays);
  const primaryDriver = resolvePrimaryDriver(delayCost, laborOverrunCost, materialOverrunCost);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    delayCost,
    laborOverrunCost,
    materialOverrunCost,
    totalExposure,
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
