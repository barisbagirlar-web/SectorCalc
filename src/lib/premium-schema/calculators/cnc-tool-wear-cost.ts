import {
  validateCncToolWearCostInputs,
  type CncToolWearCostInputs,
} from "@/lib/premium-schema/calculators/cnc-tool-wear-cost-validation";

export type { CncToolWearCostInputs };

export type CncToolWearCostSummaryLevel = "low" | "warning" | "critical";

export type CncToolWearCostPrimaryDriver = "totalExposure";

export type CncToolWearCostResult = {
  toolCostPerPart: number;
  toolChangeDowntimeCost: number;
  totalExposure: number;
  summaryLevel: CncToolWearCostSummaryLevel;
  primaryDriver: CncToolWearCostPrimaryDriver;
  decisionVerdict: {
    summaryLevel: CncToolWearCostSummaryLevel;
    primaryDriver: CncToolWearCostPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const TOOL_COST_PER_PART_WARNING_THRESHOLD = 0.5;
const TOOL_COST_PER_PART_CRITICAL_THRESHOLD = 1.5;

function resolveSummaryLevel(toolCostPerPart: number): CncToolWearCostSummaryLevel {
  if (toolCostPerPart >= TOOL_COST_PER_PART_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (toolCostPerPart >= TOOL_COST_PER_PART_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: CncToolWearCostSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Per-part tool cost is below the warning band. Continue monitoring insert life, changeover time and coolant spend.";
  }
  if (summaryLevel === "warning") {
    return "Per-part tool cost is elevated. Review insert life, quoting allowance and changeover downtime before accepting repeat jobs.";
  }
  return "Per-part tool cost is critical. Reprice repeat jobs and validate tool change schedule before production release.";
}

export function calculateCncToolWearCost(inputs: CncToolWearCostInputs): CncToolWearCostResult {
  const validation = validateCncToolWearCostInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const toolCostPerPart = inputs.monthlyToolCost / inputs.partsProduced;
  const toolChangeDowntimeCost =
    (inputs.toolChangeMinutes / 60) * inputs.changesPerMonth * inputs.hourlyCost;
  const totalExposure = inputs.monthlyToolCost + toolChangeDowntimeCost + inputs.coolantCost;
  const summaryLevel = resolveSummaryLevel(toolCostPerPart);
  const primaryDriver: CncToolWearCostPrimaryDriver = "totalExposure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    toolCostPerPart,
    toolChangeDowntimeCost,
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
