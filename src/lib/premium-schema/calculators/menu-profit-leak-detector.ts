import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateMenuProfitLeakDetectorInputs,
  type MenuProfitLeakDetectorInputs,
} from "@/lib/premium-schema/calculators/menu-profit-leak-detector-validation";

export type { MenuProfitLeakDetectorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.food_cost_percent",
    "inputMap": {
      "ingredientCost": "ingredientCost",
      "monthlyRevenue": "monthlyRevenue"
    },
    "outputId": "foodCostPercent"
  },
  {
    "formulaId": "cost.delivery_fee_cost",
    "inputMap": {
      "monthlyRevenue": "monthlyRevenue",
      "deliveryAppFeePercent": "deliveryAppFeePercent"
    },
    "outputId": "deliveryFeeCost"
  },
  {
    "formulaId": "loss.waste_exposure",
    "inputMap": {
      "monthlyIngredientCost": "ingredientCost",
      "wasteRate": "wasteRate"
    },
    "outputId": "wasteExposure"
  },
  {
    "formulaId": "cost.restaurant_margin_pressure",
    "inputMap": {
      "ingredientCost": "ingredientCost",
      "deliveryFeeCost": "deliveryFeeCost",
      "wasteExposure": "wasteExposure",
      "monthlyRevenue": "monthlyRevenue"
    },
    "outputId": "totalMarginPressure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.05;

const SUMMARY_WARNING_THRESHOLD = 45;
const SUMMARY_CRITICAL_THRESHOLD = 55;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: MenuProfitLeakDetectorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof MenuProfitLeakDetectorInputs] as number;
}

function runFormulaPipeline(inputs: MenuProfitLeakDetectorInputs): Record<string, number> {
  const computed: Record<string, number> = {
    hiddenMultiplierConst: HIDDEN_LOSS_MULTIPLIER,
  };

  for (const step of FORMULA_PIPELINE) {
    const formulaFn = getFormulaFn(step.formulaId);
    const mapped: Record<string, number> = {};
    for (const [param, sourceKey] of Object.entries(step.inputMap)) {
      mapped[param] = resolveMappedValue(sourceKey, inputs, computed);
    }
    computed[step.outputId] = formulaFn(mapped);
  }

  return computed;
}

function resolveSummaryLevel(summaryValue: number): SummaryLevel {
  if (summaryDirection === "higher_is_bad") {
    if (summaryValue >= SUMMARY_CRITICAL_THRESHOLD) return "critical";
    if (summaryValue >= SUMMARY_WARNING_THRESHOLD) return "warning";
    return "low";
  }
  if (summaryValue <= SUMMARY_CRITICAL_THRESHOLD) return "critical";
  if (summaryValue <= SUMMARY_WARNING_THRESHOLD) return "warning";
  return "low";
}

function resolveDecisionMessage(summaryLevel: SummaryLevel): string {
  if (summaryLevel === "low") {
    return "Exposure is below the warning band. Continue monitoring declared cost and margin assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Exposure is elevated. Review input assumptions and hidden cost drivers before committing to this envelope.";
  }
  return "Critical exposure detected. Validate cost, rework and margin assumptions before quoting or scaling.";
}

export function calculateMenuProfitLeakDetector(inputs: MenuProfitLeakDetectorInputs): {
  totalMarginPressure: number;
  foodCostPercent: number;
  deliveryFeeCost: number;
  wasteExposure: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalMarginPressure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalMarginPressure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateMenuProfitLeakDetectorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalMarginPressure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalMarginPressure: computed.totalMarginPressure,
    foodCostPercent: computed.foodCostPercent,
    deliveryFeeCost: computed.deliveryFeeCost,
    wasteExposure: computed.wasteExposure,
    summaryLevel,
    primaryDriver: "totalMarginPressure",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalMarginPressure",
      message,
    },
    warnings: [...validation.warnings],
  };
}
