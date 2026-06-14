import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateMealPlanningVerdictInputs,
  type MealPlanningVerdictInputs,
} from "@/lib/premium-schema/calculators/meal-planning-verdict-validation";

export type { MealPlanningVerdictInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "loss.waste_exposure",
    "inputMap": {
      "monthlyIngredientCost": "monthlyIngredientCost",
      "wasteRate": "wasteRate"
    },
    "outputId": "wasteExposure"
  },
  {
    "formulaId": "loss.excess_waste_cost",
    "inputMap": {
      "monthlyIngredientCost": "monthlyIngredientCost",
      "wasteRate": "wasteRate",
      "targetWasteRate": "targetWasteRate"
    },
    "outputId": "excessWasteCost"
  },
  {
    "formulaId": "cost.margin_pressure",
    "inputMap": {
      "excessCost": "excessWasteCost",
      "monthlyRevenue": "monthlyRevenue"
    },
    "outputId": "marginPressure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.06;

const SUMMARY_WARNING_THRESHOLD = 1;
const SUMMARY_CRITICAL_THRESHOLD = 3;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: MealPlanningVerdictInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof MealPlanningVerdictInputs] as number;
}

function runFormulaPipeline(inputs: MealPlanningVerdictInputs): Record<string, number> {
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

export function calculateMealPlanningVerdict(inputs: MealPlanningVerdictInputs): {
  wasteExposure: number;
  excessWasteCost: number;
  marginPressure: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "marginPressure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "marginPressure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateMealPlanningVerdictInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.marginPressure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    wasteExposure: computed.wasteExposure,
    excessWasteCost: computed.excessWasteCost,
    marginPressure: computed.marginPressure,
    summaryLevel,
    primaryDriver: "marginPressure",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "marginPressure",
      message,
    },
    warnings: [...validation.warnings],
  };
}
