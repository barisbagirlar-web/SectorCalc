import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateAnnualLeaveSeveranceNoticeCalculatorInputs,
  type AnnualLeaveSeveranceNoticeCalculatorInputs,
} from "@/lib/premium-schema/calculators/annual-leave-severance-notice-calculator-validation";

export type { AnnualLeaveSeveranceNoticeCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.employer_burden_total",
    "inputMap": {
      "grossMonthlySalary": "grossMonthlySalary",
      "employerBurdenPercent": "employerBurdenPercent"
    },
    "outputId": "employerMonthlyCost"
  },
  {
    "formulaId": "cost.severance_screening",
    "inputMap": {
      "grossMonthlySalary": "grossMonthlySalary",
      "yearsOfService": "yearsOfService",
      "severanceWeeksPerYear": "severanceWeeksPerYear"
    },
    "outputId": "severanceEstimate"
  },
  {
    "formulaId": "cost.notice_screening",
    "inputMap": {
      "grossMonthlySalary": "grossMonthlySalary",
      "noticeWeeks": "noticeWeeks"
    },
    "outputId": "noticeEstimate"
  },
  {
    "formulaId": "cost.sum2",
    "inputMap": {
      "a": "severanceEstimate",
      "b": "noticeEstimate"
    },
    "outputId": "totalExitExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 25000;
const SUMMARY_CRITICAL_THRESHOLD = 60000;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: AnnualLeaveSeveranceNoticeCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof AnnualLeaveSeveranceNoticeCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: AnnualLeaveSeveranceNoticeCalculatorInputs): Record<string, number> {
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

export function calculateAnnualLeaveSeveranceNoticeCalculator(inputs: AnnualLeaveSeveranceNoticeCalculatorInputs): {
  totalExitExposure: number;
  severanceEstimate: number;
  noticeEstimate: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalExitExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalExitExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateAnnualLeaveSeveranceNoticeCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExitExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalExitExposure: computed.totalExitExposure,
    severanceEstimate: computed.severanceEstimate,
    noticeEstimate: computed.noticeEstimate,
    summaryLevel,
    primaryDriver: "totalExitExposure",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalExitExposure",
      message,
    },
    warnings: [...validation.warnings],
  };
}
