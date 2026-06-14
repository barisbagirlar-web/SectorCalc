import {
  validateThreeDPrintJobMarginToolInputs,
  type ThreeDPrintJobMarginToolInputs,
} from "@/lib/premium-schema/calculators/3d-print-job-margin-tool-validation";

export type { ThreeDPrintJobMarginToolInputs };

export type SummaryLevel = "low" | "warning" | "critical";

export type ThreeDPrintJobMarginToolCoreResult = {
  baseCost: number;
  scrapCost: number;
  overheadCost: number;
  totalCost: number;
  quotePrice: number;
  grossProfit: number;
  grossMarginPercent: number;
};

const SUMMARY_WARNING_THRESHOLD = 15;
const SUMMARY_CRITICAL_THRESHOLD = 30;

function resolveSummaryLevel(failureScrapRatePercent: number): SummaryLevel {
  if (failureScrapRatePercent >= SUMMARY_CRITICAL_THRESHOLD) return "critical";
  if (failureScrapRatePercent >= SUMMARY_WARNING_THRESHOLD) return "warning";
  return "low";
}

function resolveDecisionMessage(summaryLevel: SummaryLevel): string {
  if (summaryLevel === "low") {
    return "Scrap exposure is within a manageable band. Continue monitoring material, machine time and post-processing assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Scrap or rework risk is elevated. Review fail-rate buffer and overhead before locking the quote price.";
  }
  return "High scrap exposure detected. Validate print parameters, support removal and rework allowance before quoting.";
}

export function computeThreeDPrintJobMarginCore(
  inputs: ThreeDPrintJobMarginToolInputs,
): ThreeDPrintJobMarginToolCoreResult {
  const baseCost =
    inputs.materialCost +
    inputs.machineTimeHours * inputs.machineHourlyRate +
    inputs.laborHours * inputs.laborHourlyRate +
    inputs.electricityCost +
    inputs.postProcessingCost;
  const scrapCost = (baseCost * inputs.failureScrapRatePercent) / 100;
  const overheadCost = (baseCost * inputs.overheadPercent) / 100;
  const totalCost = baseCost + scrapCost + overheadCost;
  const quotePrice = totalCost / (1 - inputs.targetMarginPercent / 100);
  const grossProfit = quotePrice - totalCost;
  const grossMarginPercent = quotePrice > 0 ? (grossProfit / quotePrice) * 100 : 0;

  return {
    baseCost,
    scrapCost,
    overheadCost,
    totalCost,
    quotePrice,
    grossProfit,
    grossMarginPercent,
  };
}

export function ThreeDPrintJobMarginToolCalculator(inputs: ThreeDPrintJobMarginToolInputs): {
  baseCost: number;
  scrapCost: number;
  overheadCost: number;
  totalCost: number;
  quotePrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "quotePrice";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "quotePrice";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateThreeDPrintJobMarginToolInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = computeThreeDPrintJobMarginCore(inputs);
  if (!Number.isFinite(computed.quotePrice)) {
    throw new Error("quotePrice must be finite.");
  }

  const summaryLevel = resolveSummaryLevel(inputs.failureScrapRatePercent);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    ...computed,
    summaryLevel,
    primaryDriver: "quotePrice",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "quotePrice",
      message,
    },
    warnings: [...validation.warnings],
  };
}
