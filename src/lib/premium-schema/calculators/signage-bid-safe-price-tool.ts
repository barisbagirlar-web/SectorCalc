import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateSignageBidSafePriceToolInputs,
  type SignageBidSafePriceToolInputs,
} from "@/lib/premium-schema/calculators/signage-bid-safe-price-tool-validation";

export type { SignageBidSafePriceToolInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "loss.waste_exposure",
    "inputMap": {
      "monthlyIngredientCost": "materialCost",
      "wasteRate": "reprintRatePercent"
    },
    "outputId": "reprintCost"
  },
  {
    "formulaId": "time.rework_cost",
    "inputMap": {
      "reworkHours": "designRevisionHours",
      "laborRate": "laborRate"
    },
    "outputId": "revisionCost"
  },
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "reprintCost",
      "b": "revisionCost",
      "c": "installReworkCost"
    },
    "outputId": "totalExposure"
  },
  {
    "formulaId": "cost.margin_pressure",
    "inputMap": {
      "excessCost": "totalExposure",
      "monthlyRevenue": "jobRevenue"
    },
    "outputId": "marginPressure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.1;

const SUMMARY_WARNING_THRESHOLD = 5;
const SUMMARY_CRITICAL_THRESHOLD = 12;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: SignageBidSafePriceToolInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof SignageBidSafePriceToolInputs] as number;
}

function runFormulaPipeline(inputs: SignageBidSafePriceToolInputs): Record<string, number> {
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

export function calculateSignageBidSafePriceTool(inputs: SignageBidSafePriceToolInputs): {
  totalExposure: number;
  reprintCost: number;
  revisionCost: number;
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
  const validation = validateSignageBidSafePriceToolInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.marginPressure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalExposure: computed.totalExposure,
    reprintCost: computed.reprintCost,
    revisionCost: computed.revisionCost,
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
