import {
  validateEnergyCompressorLeakCostInputs,
  type EnergyCompressorLeakCostInputs,
} from "@/lib/premium-schema/calculators/energy-compressor-leak-cost-validation";

export type { EnergyCompressorLeakCostInputs };

export type EnergyCompressorLeakCostSummaryLevel = "low" | "warning" | "critical";

export type EnergyCompressorLeakCostPrimaryDriver = "monthlyLeakCost";

export type EnergyCompressorLeakCostResult = {
  leakKwh: number;
  monthlyLeakCost: number;
  annualLeakCost: number;
  summaryLevel: EnergyCompressorLeakCostSummaryLevel;
  primaryDriver: EnergyCompressorLeakCostPrimaryDriver;
  decisionVerdict: {
    summaryLevel: EnergyCompressorLeakCostSummaryLevel;
    primaryDriver: EnergyCompressorLeakCostPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const MONTHLY_COST_WARNING_THRESHOLD = 500;
const MONTHLY_COST_CRITICAL_THRESHOLD = 1500;

function resolveSummaryLevel(monthlyLeakCost: number): EnergyCompressorLeakCostSummaryLevel {
  if (monthlyLeakCost >= MONTHLY_COST_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (monthlyLeakCost >= MONTHLY_COST_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: EnergyCompressorLeakCostSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Monthly leak cost is below the warning threshold. Continue monitoring leak percent and operating hours assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Monthly leak cost is material. Prioritize valve, fitting and hose repairs on the compressed air network.";
  }
  return "Monthly leak cost is critical. Treat compressed air leaks as active overhead, not fixed utility noise.";
}

export function calculateEnergyCompressorLeakCost(
  inputs: EnergyCompressorLeakCostInputs,
): EnergyCompressorLeakCostResult {
  const validation = validateEnergyCompressorLeakCostInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const leakKwh = inputs.compressorKw * inputs.operatingHours * (inputs.leakPercent / 100);
  const monthlyLeakCost = leakKwh * inputs.energyRate;
  const annualLeakCost = monthlyLeakCost * 12;
  const summaryLevel = resolveSummaryLevel(monthlyLeakCost);
  const primaryDriver: EnergyCompressorLeakCostPrimaryDriver = "monthlyLeakCost";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    leakKwh,
    monthlyLeakCost,
    annualLeakCost,
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
