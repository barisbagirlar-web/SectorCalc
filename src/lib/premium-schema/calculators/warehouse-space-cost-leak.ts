import {
  validateWarehouseSpaceCostLeakInputs,
  type WarehouseSpaceCostLeakInputs,
} from "@/lib/premium-schema/calculators/warehouse-space-cost-leak-validation";

export type { WarehouseSpaceCostLeakInputs };

export type WarehouseSpaceCostLeakSummaryLevel = "low" | "warning" | "critical";

export type WarehouseSpaceCostLeakPrimaryDriver = "totalExposure";

export type WarehouseSpaceCostLeakResult = {
  unusedSpaceCost: number;
  handlingOverrunCost: number;
  totalExposure: number;
  summaryLevel: WarehouseSpaceCostLeakSummaryLevel;
  primaryDriver: WarehouseSpaceCostLeakPrimaryDriver;
  decisionVerdict: {
    summaryLevel: WarehouseSpaceCostLeakSummaryLevel;
    primaryDriver: WarehouseSpaceCostLeakPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const UNUSED_SPACE_PERCENT_WARNING_THRESHOLD = 10;
const UNUSED_SPACE_PERCENT_CRITICAL_THRESHOLD = 20;

function resolveSummaryLevel(unusedSpacePercent: number): WarehouseSpaceCostLeakSummaryLevel {
  if (unusedSpacePercent >= UNUSED_SPACE_PERCENT_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (unusedSpacePercent >= UNUSED_SPACE_PERCENT_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: WarehouseSpaceCostLeakSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Warehouse space utilization is below the warning band. Continue monitoring unused space and handling overrun assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Unused space is above typical band. Review slotting and handling overrun before adding warehouse capacity.";
  }
  return "Critical unused space detected. Expand utilization before adding capacity or accepting similar rent envelope.";
}

export function calculateWarehouseSpaceCostLeak(
  inputs: WarehouseSpaceCostLeakInputs,
): WarehouseSpaceCostLeakResult {
  const validation = validateWarehouseSpaceCostLeakInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const unusedSpaceCost = inputs.monthlyRent * (inputs.unusedSpacePercent / 100);
  const handlingOverrunCost = inputs.handlingOverrunHours * inputs.hourlyCost;
  const totalExposure = unusedSpaceCost + handlingOverrunCost;
  const summaryLevel = resolveSummaryLevel(inputs.unusedSpacePercent);
  const primaryDriver: WarehouseSpaceCostLeakPrimaryDriver = "totalExposure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    unusedSpaceCost,
    handlingOverrunCost,
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
