import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validatePlumbingJobMarginVerdictInputs,
  type PlumbingJobMarginVerdictInputs,
} from "@/lib/premium-schema/calculators/plumbing-job-margin-verdict-validation";

export type { PlumbingJobMarginVerdictInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.count_cost",
    "inputMap": {
      "count": "callbackVisits",
      "costEach": "visitCost"
    },
    "outputId": "callbackCost"
  },
  {
    "formulaId": "cost.percent_of_amount",
    "inputMap": {
      "amount": "jobRevenue",
      "percent": "warrantyReservePercent"
    },
    "outputId": "warrantyReserve"
  },
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "callbackCost",
      "b": "materialRunCost",
      "c": "warrantyReserve"
    },
    "outputId": "totalExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.08;

const SUMMARY_WARNING_THRESHOLD = 2;
const SUMMARY_CRITICAL_THRESHOLD = 5;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: PlumbingJobMarginVerdictInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof PlumbingJobMarginVerdictInputs] as number;
}

function runFormulaPipeline(inputs: PlumbingJobMarginVerdictInputs): Record<string, number> {
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

export function calculatePlumbingJobMarginVerdict(inputs: PlumbingJobMarginVerdictInputs): {
  totalExposure: number;
  callbackCost: number;
  warrantyReserve: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validatePlumbingJobMarginVerdictInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalExposure: computed.totalExposure,
    callbackCost: computed.callbackCost,
    warrantyReserve: computed.warrantyReserve,
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
