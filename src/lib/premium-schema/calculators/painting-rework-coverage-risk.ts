import {
  validatePaintingReworkCoverageRiskInputs,
  type PaintingReworkCoverageRiskInputs,
} from "@/lib/premium-schema/calculators/painting-rework-coverage-risk-validation";

export type { PaintingReworkCoverageRiskInputs };

export type PaintingReworkCoverageRiskSummaryLevel = "low" | "warning" | "critical";

export type PaintingReworkCoverageRiskPrimaryDriver = "marginPressure";

export type PaintingReworkCoverageRiskResult = {
  coverageDriftCost: number;
  prepReworkCost: number;
  totalExposure: number;
  marginPressure: number;
  summaryLevel: PaintingReworkCoverageRiskSummaryLevel;
  primaryDriver: PaintingReworkCoverageRiskPrimaryDriver;
  decisionVerdict: {
    summaryLevel: PaintingReworkCoverageRiskSummaryLevel;
    primaryDriver: PaintingReworkCoverageRiskPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const MARGIN_PRESSURE_WARNING_THRESHOLD = 5;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 12;

function resolveSummaryLevel(marginPressure: number): PaintingReworkCoverageRiskSummaryLevel {
  if (marginPressure >= MARGIN_PRESSURE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (marginPressure >= MARGIN_PRESSURE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: PaintingReworkCoverageRiskSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Painting rework margin pressure is below the warning band. Continue monitoring coverage drift and prep rework assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Margin pressure is building on this painting envelope. Review spread rate, prep hours and scaffold cost before final quote.";
  }
  return "Critical margin pressure detected. Touch-up, coverage drift and scaffold cost may erase profit — reprice before quoting by square meter.";
}

export function calculatePaintingReworkCoverageRisk(
  inputs: PaintingReworkCoverageRiskInputs,
): PaintingReworkCoverageRiskResult {
  const validation = validatePaintingReworkCoverageRiskInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const coverageDriftCost = inputs.paintMaterialCost * (inputs.coverageDriftPercent / 100);
  const prepReworkCost = inputs.prepReworkHours * inputs.laborRate;
  const totalExposure = coverageDriftCost + prepReworkCost + inputs.scaffoldCost;
  const marginPressure = (totalExposure / inputs.jobRevenue) * 100;
  const summaryLevel = resolveSummaryLevel(marginPressure);
  const primaryDriver: PaintingReworkCoverageRiskPrimaryDriver = "marginPressure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    coverageDriftCost,
    prepReworkCost,
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
