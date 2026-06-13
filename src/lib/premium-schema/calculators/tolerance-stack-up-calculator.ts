import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateToleranceStackUpCalculatorInputs,
  type ToleranceStackUpCalculatorInputs,
} from "@/lib/premium-schema/calculators/tolerance-stack-up-calculator-validation";

export type { ToleranceStackUpCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "calibration.tolerance_worst_case_stack",
    "inputMap": {
      "t1": "t1",
      "t2": "t2",
      "t3": "t3",
      "t4": "t4"
    },
    "outputId": "worstCaseStack"
  },
  {
    "formulaId": "calibration.tolerance_rss_stack",
    "inputMap": {
      "t1": "t1",
      "t2": "t2",
      "t3": "t3",
      "t4": "t4"
    },
    "outputId": "rssStack"
  },
  {
    "formulaId": "cost.difference",
    "inputMap": {
      "a": "assemblyLimit",
      "b": "worstCaseStack"
    },
    "outputId": "worstCaseClearance"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 0.05;
const SUMMARY_CRITICAL_THRESHOLD = 0;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "lower_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: ToleranceStackUpCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof ToleranceStackUpCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: ToleranceStackUpCalculatorInputs): Record<string, number> {
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

export function calculateToleranceStackUpCalculator(inputs: ToleranceStackUpCalculatorInputs): {
  worstCaseStack: number;
  rssStack: number;
  worstCaseClearance: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "worstCaseStack";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "worstCaseStack";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateToleranceStackUpCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.worstCaseStack ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    worstCaseStack: computed.worstCaseStack,
    rssStack: computed.rssStack,
    worstCaseClearance: computed.worstCaseClearance,
    summaryLevel,
    primaryDriver: "worstCaseStack",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "worstCaseStack",
      message,
    },
    warnings: [...validation.warnings],
  };
}
