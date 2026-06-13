import {
  validateSheetMetalScrapRiskInputs,
  type SheetMetalScrapRiskInputs,
} from "@/lib/premium-schema/calculators/sheet-metal-scrap-risk-validation";

export type { SheetMetalScrapRiskInputs };

export type SheetMetalScrapRiskSummaryLevel = "low" | "warning" | "critical";

export type SheetMetalScrapRiskPrimaryDriver = "totalExposure";

export type SheetMetalScrapRiskResult = {
  excessScrapCost: number;
  reworkCost: number;
  finishingCost: number;
  totalExposure: number;
  summaryLevel: SheetMetalScrapRiskSummaryLevel;
  primaryDriver: SheetMetalScrapRiskPrimaryDriver;
  decisionVerdict: {
    summaryLevel: SheetMetalScrapRiskSummaryLevel;
    primaryDriver: SheetMetalScrapRiskPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const SCRAP_RATE_WARNING_THRESHOLD = 5;
const SCRAP_RATE_CRITICAL_THRESHOLD = 10;

function resolveSummaryLevel(scrapRate: number): SheetMetalScrapRiskSummaryLevel {
  if (scrapRate >= SCRAP_RATE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (scrapRate >= SCRAP_RATE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: SheetMetalScrapRiskSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Sheet metal scrap risk is below the warning band. Continue monitoring scrap rate and rework assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Scrap rate is above target. Review nesting, bend tolerance and rework hours before final quote.";
  }
  return "Critical scrap band detected. Reprice material and rework before accepting similar fabrication.";
}

export function calculateSheetMetalScrapRisk(
  inputs: SheetMetalScrapRiskInputs,
): SheetMetalScrapRiskResult {
  const validation = validateSheetMetalScrapRiskInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const excessScrapCost =
    inputs.materialCost * (Math.max(inputs.scrapRate - inputs.targetScrapRate, 0) / 100);
  const reworkCost = inputs.reworkHours * inputs.laborRate;
  const finishingCost = inputs.finishingCost;
  const totalExposure = excessScrapCost + reworkCost + finishingCost;
  const summaryLevel = resolveSummaryLevel(inputs.scrapRate);
  const primaryDriver: SheetMetalScrapRiskPrimaryDriver = "totalExposure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    excessScrapCost,
    reworkCost,
    finishingCost,
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
