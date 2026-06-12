import {
  validateAgricultureIrrigationYieldLossInputs,
  type AgricultureIrrigationYieldLossInputs,
} from "@/lib/premium-schema/calculators/agriculture-irrigation-yield-loss-validation";

export type { AgricultureIrrigationYieldLossInputs };

export type AgricultureIrrigationSummaryLevel = "low" | "warning" | "critical";

export type AgricultureIrrigationPrimaryDriver = "yieldLossRevenue" | "irrigationCost";

export type AgricultureIrrigationYieldLossResult = {
  yieldGapTonPerHa: number;
  lostYieldTon: number;
  yieldLossRevenue: number;
  irrigationCost: number;
  totalExposure: number;
  exposurePerHa: number;
  yieldLossPct: number;
  summaryLevel: AgricultureIrrigationSummaryLevel;
  primaryDriver: AgricultureIrrigationPrimaryDriver;
  decisionVerdict: {
    summaryLevel: AgricultureIrrigationSummaryLevel;
    primaryDriver: AgricultureIrrigationPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const WARNING_THRESHOLD = 3000;
const CRITICAL_THRESHOLD = 8000;

function resolveSummaryLevel(totalExposure: number): AgricultureIrrigationSummaryLevel {
  if (totalExposure >= CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (totalExposure >= WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolvePrimaryDriver(
  yieldLossRevenue: number,
  irrigationCost: number,
): AgricultureIrrigationPrimaryDriver {
  return yieldLossRevenue >= irrigationCost ? "yieldLossRevenue" : "irrigationCost";
}

function resolveDecisionMessage(summaryLevel: AgricultureIrrigationSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Estimated exposure is below the warning threshold. Monitor yield and irrigation cost assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Estimated exposure is material. Review irrigation cost, yield assumptions and seasonal loss drivers.";
  }
  return "Estimated exposure is critical. Prioritize validation of yield gap, irrigation cost scope and revenue assumptions.";
}

export function calculateAgricultureIrrigationYieldLoss(
  inputs: AgricultureIrrigationYieldLossInputs,
): AgricultureIrrigationYieldLossResult {
  const validation = validateAgricultureIrrigationYieldLossInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const yieldGapTonPerHa = Math.max(
    inputs.expectedYieldTonPerHa - inputs.actualYieldTonPerHa,
    0,
  );
  const lostYieldTon = inputs.areaHa * yieldGapTonPerHa;
  const yieldLossRevenue = lostYieldTon * inputs.pricePerTon;
  const irrigationCost = inputs.irrigationCost;
  const totalExposure = yieldLossRevenue + irrigationCost;
  const exposurePerHa = totalExposure / inputs.areaHa;
  const yieldLossPct = (yieldGapTonPerHa / inputs.expectedYieldTonPerHa) * 100;
  const summaryLevel = resolveSummaryLevel(totalExposure);
  const primaryDriver = resolvePrimaryDriver(yieldLossRevenue, irrigationCost);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    yieldGapTonPerHa,
    lostYieldTon,
    yieldLossRevenue,
    irrigationCost,
    totalExposure,
    exposurePerHa,
    yieldLossPct,
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
