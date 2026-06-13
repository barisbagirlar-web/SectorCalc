import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateValueStreamMapVsmCalculatorInputs,
  type ValueStreamMapVsmCalculatorInputs,
} from "@/lib/premium-schema/calculators/value-stream-map-vsm-calculator-validation";

export type { ValueStreamMapVsmCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "time.vsm_total_lead_time",
    "inputMap": {
      "processMinutes": "processMinutes",
      "waitMinutes": "waitMinutes",
      "transportMinutes": "transportMinutes"
    },
    "outputId": "totalLeadMinutes"
  },
  {
    "formulaId": "benchmark.value_added_percent",
    "inputMap": {
      "valueAddedMinutes": "processMinutes",
      "totalLeadMinutes": "totalLeadMinutes"
    },
    "outputId": "valueAddedPercent"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 1;
const SUMMARY_CRITICAL_THRESHOLD = 3;
const SUMMARY_DIRECTION = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: ValueStreamMapVsmCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof ValueStreamMapVsmCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: ValueStreamMapVsmCalculatorInputs): Record<string, number> {
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
  if (SUMMARY_DIRECTION === "higher_is_bad") {
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

export function calculateValueStreamMapVsmCalculator(inputs: ValueStreamMapVsmCalculatorInputs): {
  totalLeadMinutes: number;
  valueAddedPercent: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalLeadMinutes";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalLeadMinutes";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateValueStreamMapVsmCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalLeadMinutes ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalLeadMinutes: computed.totalLeadMinutes,
    valueAddedPercent: computed.valueAddedPercent,
    summaryLevel,
    primaryDriver: "totalLeadMinutes",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalLeadMinutes",
      message,
    },
    warnings: [...validation.warnings],
  };
}
