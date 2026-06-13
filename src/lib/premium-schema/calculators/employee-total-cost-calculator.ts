import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateEmployeeTotalCostCalculatorInputs,
  type EmployeeTotalCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/employee-total-cost-calculator-validation";

export type { EmployeeTotalCostCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.percent_of_amount",
    "inputMap": {
      "amount": "grossSalary",
      "percent": "employerRatePercent"
    },
    "outputId": "employerLoad"
  },
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "grossSalary",
      "b": "employerLoad",
      "c": "monthlyBenefits"
    },
    "outputId": "totalEmployerCost"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.02;

const SUMMARY_WARNING_THRESHOLD = 6000;
const SUMMARY_CRITICAL_THRESHOLD = 9000;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: EmployeeTotalCostCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof EmployeeTotalCostCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: EmployeeTotalCostCalculatorInputs): Record<string, number> {
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

export function calculateEmployeeTotalCostCalculator(inputs: EmployeeTotalCostCalculatorInputs): {
  totalEmployerCost: number;
  employerLoad: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalEmployerCost";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalEmployerCost";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateEmployeeTotalCostCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalEmployerCost ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalEmployerCost: computed.totalEmployerCost,
    employerLoad: computed.employerLoad,
    summaryLevel,
    primaryDriver: "totalEmployerCost",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalEmployerCost",
      message,
    },
    warnings: [...validation.warnings],
  };
}
