import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateReturnProfitErosionToolInputs,
  type ReturnProfitErosionToolInputs,
} from "@/lib/premium-schema/calculators/return-profit-erosion-tool-validation";

export type { ReturnProfitErosionToolInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cloud.api_call_cost",
    "inputMap": {
      "monthlyApiCalls": "monthlyApiCalls",
      "costPerThousandCalls": "costPerThousandCalls"
    },
    "outputId": "apiCallCost"
  },
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "apiCallCost",
      "b": "computeCost",
      "c": "storageCost"
    },
    "outputId": "totalCloudCost"
  },
  {
    "formulaId": "cost.margin_pressure",
    "inputMap": {
      "excessCost": "totalCloudCost",
      "monthlyRevenue": "monthlyRevenue"
    },
    "outputId": "revenuePressure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.06;

const SUMMARY_WARNING_THRESHOLD = 15;
const SUMMARY_CRITICAL_THRESHOLD = 30;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: ReturnProfitErosionToolInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof ReturnProfitErosionToolInputs] as number;
}

function runFormulaPipeline(inputs: ReturnProfitErosionToolInputs): Record<string, number> {
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

export function calculateReturnProfitErosionTool(inputs: ReturnProfitErosionToolInputs): {
  totalCloudCost: number;
  apiCallCost: number;
  revenuePressure: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalCloudCost";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalCloudCost";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateReturnProfitErosionToolInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalCloudCost ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalCloudCost: computed.totalCloudCost,
    apiCallCost: computed.apiCallCost,
    revenuePressure: computed.revenuePressure,
    summaryLevel,
    primaryDriver: "totalCloudCost",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalCloudCost",
      message,
    },
    warnings: [...validation.warnings],
  };
}
