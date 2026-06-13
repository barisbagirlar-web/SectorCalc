import {
  validatePrintingReprintMarginLeakInputs,
  type PrintingReprintMarginLeakInputs,
} from "@/lib/premium-schema/calculators/printing-reprint-margin-leak-validation";

export type { PrintingReprintMarginLeakInputs };

export type PrintingReprintMarginLeakSummaryLevel = "low" | "warning" | "critical";

export type PrintingReprintMarginLeakPrimaryDriver = "marginPressure";

export type PrintingReprintMarginLeakResult = {
  reprintCost: number;
  revisionCost: number;
  totalExposure: number;
  marginPressure: number;
  summaryLevel: PrintingReprintMarginLeakSummaryLevel;
  primaryDriver: PrintingReprintMarginLeakPrimaryDriver;
  decisionVerdict: {
    summaryLevel: PrintingReprintMarginLeakSummaryLevel;
    primaryDriver: PrintingReprintMarginLeakPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const MARGIN_PRESSURE_WARNING_THRESHOLD = 5;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 12;

function resolveSummaryLevel(marginPressure: number): PrintingReprintMarginLeakSummaryLevel {
  if (marginPressure >= MARGIN_PRESSURE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (marginPressure >= MARGIN_PRESSURE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: PrintingReprintMarginLeakSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Printing reprint margin pressure is below the warning band. Continue monitoring reprint rate and revision assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Margin pressure is building on this print job envelope. Review reprint rate, design hours and install rework before final quote.";
  }
  return "Critical margin pressure detected. Reprint and install rework may erase profit — reprice before accepting similar print work.";
}

export function calculatePrintingReprintMarginLeak(
  inputs: PrintingReprintMarginLeakInputs,
): PrintingReprintMarginLeakResult {
  const validation = validatePrintingReprintMarginLeakInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const reprintCost = inputs.materialCost * (inputs.reprintRatePercent / 100);
  const revisionCost = inputs.designRevisionHours * inputs.laborRate;
  const totalExposure = reprintCost + revisionCost + inputs.installReworkCost;
  const marginPressure = (totalExposure / inputs.jobRevenue) * 100;
  const summaryLevel = resolveSummaryLevel(marginPressure);
  const primaryDriver: PrintingReprintMarginLeakPrimaryDriver = "marginPressure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    reprintCost,
    revisionCost,
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
