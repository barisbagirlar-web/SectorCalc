import {
  validateRestaurantMenuMarginLeakInputs,
  type RestaurantMenuMarginLeakInputs,
} from "@/lib/premium-schema/calculators/restaurant-menu-margin-leak-validation";

export type { RestaurantMenuMarginLeakInputs };

export type RestaurantMenuMarginLeakSummaryLevel = "low" | "warning" | "critical";

export type RestaurantMenuMarginLeakPrimaryDriver = "totalMarginPressure";

export type RestaurantMenuMarginLeakResult = {
  foodCostPercent: number;
  deliveryFeeCost: number;
  wasteExposure: number;
  totalMarginPressure: number;
  summaryLevel: RestaurantMenuMarginLeakSummaryLevel;
  primaryDriver: RestaurantMenuMarginLeakPrimaryDriver;
  decisionVerdict: {
    summaryLevel: RestaurantMenuMarginLeakSummaryLevel;
    primaryDriver: RestaurantMenuMarginLeakPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const TOTAL_MARGIN_PRESSURE_WARNING_THRESHOLD = 45;
const TOTAL_MARGIN_PRESSURE_CRITICAL_THRESHOLD = 55;

function resolveSummaryLevel(
  totalMarginPressure: number,
): RestaurantMenuMarginLeakSummaryLevel {
  if (totalMarginPressure >= TOTAL_MARGIN_PRESSURE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (totalMarginPressure >= TOTAL_MARGIN_PRESSURE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: RestaurantMenuMarginLeakSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Restaurant menu margin pressure is below the warning band. Continue monitoring food cost, delivery fees and waste assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Combined cost pressure is building on this menu mix. Review ingredient cost, delivery fees and waste before scaling channel volume.";
  }
  return "Critical margin pressure detected. Menu economics may not support current channel mix — reprice or reformulate before scaling.";
}

export function calculateRestaurantMenuMarginLeak(
  inputs: RestaurantMenuMarginLeakInputs,
): RestaurantMenuMarginLeakResult {
  const validation = validateRestaurantMenuMarginLeakInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const foodCostPercent = (inputs.ingredientCost / inputs.monthlyRevenue) * 100;
  const deliveryFeeCost = inputs.monthlyRevenue * (inputs.deliveryAppFeePercent / 100);
  const wasteExposure = inputs.ingredientCost * (inputs.wasteRate / 100);
  const totalMarginPressure =
    ((inputs.ingredientCost + deliveryFeeCost + wasteExposure) / inputs.monthlyRevenue) * 100;
  const summaryLevel = resolveSummaryLevel(totalMarginPressure);
  const primaryDriver: RestaurantMenuMarginLeakPrimaryDriver = "totalMarginPressure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    foodCostPercent,
    deliveryFeeCost,
    wasteExposure,
    totalMarginPressure,
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
