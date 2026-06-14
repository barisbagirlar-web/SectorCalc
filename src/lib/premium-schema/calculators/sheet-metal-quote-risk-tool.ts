import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateSheetMetalQuoteRiskToolInputs,
  type SheetMetalQuoteRiskToolInputs,
} from "@/lib/premium-schema/calculators/sheet-metal-quote-risk-tool-validation";

export type { SheetMetalQuoteRiskToolInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "loss.excess_waste_cost",
    "inputMap": {
      "monthlyIngredientCost": "materialCost",
      "wasteRate": "scrapRate",
      "targetWasteRate": "targetScrapRate"
    },
    "outputId": "excessScrapCost"
  },
  {
    "formulaId": "time.rework_cost",
    "inputMap": {
      "reworkHours": "reworkHours",
      "laborRate": "laborRate"
    },
    "outputId": "reworkCost"
  },
  {
    "formulaId": "cost.value",
    "inputMap": {
      "value": "finishingCost"
    },
    "outputId": "finishingCost"
  },
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "excessScrapCost",
      "b": "reworkCost",
      "c": "finishingCost"
    },
    "outputId": "totalExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.08;

const SUMMARY_WARNING_THRESHOLD = 5;
const SUMMARY_CRITICAL_THRESHOLD = 10;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: SheetMetalQuoteRiskToolInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof SheetMetalQuoteRiskToolInputs] as number;
}

function runFormulaPipeline(inputs: SheetMetalQuoteRiskToolInputs): Record<string, number> {
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

export function calculateSheetMetalQuoteRiskTool(inputs: SheetMetalQuoteRiskToolInputs): {
  totalExposure: number;
  excessScrapCost: number;
  reworkCost: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateSheetMetalQuoteRiskToolInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalExposure: computed.totalExposure,
    excessScrapCost: computed.excessScrapCost,
    reworkCost: computed.reworkCost,
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
