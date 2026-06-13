import {
  validateFoodWasteMarginLossInputs,
  type FoodWasteMarginLossInputs,
} from "@/lib/premium-schema/calculators/food-waste-margin-loss-validation";

export type { FoodWasteMarginLossInputs };

export type FoodWasteMarginLossSummaryLevel = "low" | "warning" | "critical";

export type FoodWasteMarginLossPrimaryDriver = "marginPressure";

export type FoodWasteMarginLossResult = {
  wasteExposure: number;
  excessWasteCost: number;
  marginPressure: number;
  summaryLevel: FoodWasteMarginLossSummaryLevel;
  primaryDriver: FoodWasteMarginLossPrimaryDriver;
  decisionVerdict: {
    summaryLevel: FoodWasteMarginLossSummaryLevel;
    primaryDriver: FoodWasteMarginLossPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const MARGIN_PRESSURE_WARNING_THRESHOLD = 1;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 3;

function resolveSummaryLevel(marginPressure: number): FoodWasteMarginLossSummaryLevel {
  if (marginPressure >= MARGIN_PRESSURE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (marginPressure >= MARGIN_PRESSURE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: FoodWasteMarginLossSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Food waste margin pressure is below the warning band. Continue monitoring waste rate and portion control assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Excess waste is pressuring revenue margin. Track waste drivers and prep yield before accepting similar volume.";
  }
  return "Critical margin pressure from food waste detected. Review portion control and purchasing before repricing or scaling.";
}

export function calculateFoodWasteMarginLoss(
  inputs: FoodWasteMarginLossInputs,
): FoodWasteMarginLossResult {
  const validation = validateFoodWasteMarginLossInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const wasteExposure = inputs.monthlyIngredientCost * (inputs.wasteRate / 100);
  const excessWasteCost =
    inputs.monthlyIngredientCost *
    (Math.max(inputs.wasteRate - inputs.targetWasteRate, 0) / 100);
  const marginPressure = (excessWasteCost / inputs.monthlyRevenue) * 100;
  const summaryLevel = resolveSummaryLevel(marginPressure);
  const primaryDriver: FoodWasteMarginLossPrimaryDriver = "marginPressure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    wasteExposure,
    excessWasteCost,
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
