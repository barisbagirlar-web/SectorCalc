import {
  validateHvacCallbackMarginRiskInputs,
  type HvacCallbackMarginRiskInputs,
} from "@/lib/premium-schema/calculators/hvac-callback-margin-risk-validation";

export type { HvacCallbackMarginRiskInputs };

export type HvacCallbackMarginRiskSummaryLevel = "low" | "warning" | "critical";

export type HvacCallbackMarginRiskPrimaryDriver = "marginPressure";

export type HvacCallbackMarginRiskResult = {
  commissioningCost: number;
  callbackRiskCost: number;
  totalExposure: number;
  marginPressure: number;
  summaryLevel: HvacCallbackMarginRiskSummaryLevel;
  primaryDriver: HvacCallbackMarginRiskPrimaryDriver;
  decisionVerdict: {
    summaryLevel: HvacCallbackMarginRiskSummaryLevel;
    primaryDriver: HvacCallbackMarginRiskPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const MARGIN_PRESSURE_WARNING_THRESHOLD = 5;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 10;

function resolveSummaryLevel(marginPressure: number): HvacCallbackMarginRiskSummaryLevel {
  if (marginPressure >= MARGIN_PRESSURE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (marginPressure >= MARGIN_PRESSURE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: HvacCallbackMarginRiskSummaryLevel): string {
  if (summaryLevel === "low") {
    return "HVAC callback margin pressure is below the warning band. Continue monitoring duct variance and commissioning assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Margin pressure is building on this HVAC project envelope. Review duct drift, commissioning hours and callback risk before final bid.";
  }
  return "Critical margin pressure detected. Hidden callback cost may erase profit — reprice before accepting similar HVAC work.";
}

export function calculateHvacCallbackMarginRisk(
  inputs: HvacCallbackMarginRiskInputs,
): HvacCallbackMarginRiskResult {
  const validation = validateHvacCallbackMarginRiskInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const commissioningCost = inputs.commissioningHours * inputs.laborRate;
  const callbackRiskCost = inputs.projectRevenue * (inputs.callbackRiskPercent / 100);
  const totalExposure = inputs.ductworkVariance + commissioningCost + callbackRiskCost;
  const marginPressure = (totalExposure / inputs.projectRevenue) * 100;
  const summaryLevel = resolveSummaryLevel(marginPressure);
  const primaryDriver: HvacCallbackMarginRiskPrimaryDriver = "marginPressure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    commissioningCost,
    callbackRiskCost,
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
