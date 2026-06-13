import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateQualityCostPafCalculatorInputs,
  type QualityCostPafCalculatorInputs,
} from "@/lib/premium-schema/calculators/quality-cost-paf-calculator-validation";

export type { QualityCostPafCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.sum3",
    "inputMap": {
      "a": "preventionCost",
      "b": "appraisalCost",
      "c": "failureCost"
    },
    "outputId": "totalQualityCost"
  },
  {
    "formulaId": "cost.ratio_percent",
    "inputMap": {
      "numerator": "totalQualityCost",
      "denominator": "revenue"
    },
    "outputId": "qualityCostPercent"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 4;
const SUMMARY_CRITICAL_THRESHOLD = 8;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: QualityCostPafCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof QualityCostPafCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: QualityCostPafCalculatorInputs): Record<string, number> {
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

export function calculateQualityCostPafCalculator(inputs: QualityCostPafCalculatorInputs): {
  totalQualityCost: number;
  qualityCostPercent: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalQualityCost";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalQualityCost";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateQualityCostPafCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalQualityCost ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalQualityCost: computed.totalQualityCost,
    qualityCostPercent: computed.qualityCostPercent,
    summaryLevel,
    primaryDriver: "totalQualityCost",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalQualityCost",
      message,
    },
    warnings: [...validation.warnings],
  };
}
