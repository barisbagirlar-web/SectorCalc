import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateDairyProfitDetectorInputs,
  type DairyProfitDetectorInputs,
} from "@/lib/premium-schema/calculators/dairy-profit-detector-validation";

export type { DairyProfitDetectorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "agriculture.feed_monthly_cost",
    "inputMap": {
      "cows": "cows",
      "feedCostPerCowPerDay": "feedCostPerCowPerDay",
      "days": "days"
    },
    "outputId": "feedCost"
  },
  {
    "formulaId": "agriculture.milk_yield_gap_revenue",
    "inputMap": {
      "cows": "cows",
      "milkLitersPerCowPerDay": "milkLitersPerCowPerDay",
      "targetMilkLitersPerCowPerDay": "targetMilkLitersPerCowPerDay",
      "milkPricePerLiter": "milkPricePerLiter",
      "days": "days"
    },
    "outputId": "milkRevenueGap"
  },
  {
    "formulaId": "cost.total2",
    "inputMap": {
      "a": "feedCost",
      "b": "milkRevenueGap"
    },
    "outputId": "totalExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.07;

const SUMMARY_WARNING_THRESHOLD = 22;
const SUMMARY_CRITICAL_THRESHOLD = 18;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "lower_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: DairyProfitDetectorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof DairyProfitDetectorInputs] as number;
}

function runFormulaPipeline(inputs: DairyProfitDetectorInputs): Record<string, number> {
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

export function calculateDairyProfitDetector(inputs: DairyProfitDetectorInputs): {
  totalExposure: number;
  feedCost: number;
  milkRevenueGap: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateDairyProfitDetectorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalExposure: computed.totalExposure,
    feedCost: computed.feedCost,
    milkRevenueGap: computed.milkRevenueGap,
    summaryLevel,
    primaryDriver: "totalExposure",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalExposure",
      message,
    },
    warnings: [...validation.warnings],
  };
}
