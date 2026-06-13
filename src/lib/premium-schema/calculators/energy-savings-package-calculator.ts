import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateEnergySavingsPackageCalculatorInputs,
  type EnergySavingsPackageCalculatorInputs,
} from "@/lib/premium-schema/calculators/energy-savings-package-calculator-validation";

export type { EnergySavingsPackageCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "energy.monthly_kwh_savings",
    "inputMap": {
      "baselineKwhMonthly": "baselineKwhMonthly",
      "proposedKwhMonthly": "proposedKwhMonthly"
    },
    "outputId": "monthlyKwhSavings"
  },
  {
    "formulaId": "energy.kwh_cost",
    "inputMap": {
      "kwh": "monthlyKwhSavings",
      "rate": "energyRate"
    },
    "outputId": "monthlySavingsCost"
  },
  {
    "formulaId": "cost.annualize",
    "inputMap": {
      "monthlyCost": "monthlySavingsCost"
    },
    "outputId": "annualSavingsCost"
  },
  {
    "formulaId": "finance.payback_years",
    "inputMap": {
      "initialInvestment": "projectCost",
      "annualSavings": "annualSavingsCost"
    },
    "outputId": "paybackYears"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 1;
const SUMMARY_CRITICAL_THRESHOLD = 3;
const SUMMARY_DIRECTION = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: EnergySavingsPackageCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof EnergySavingsPackageCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: EnergySavingsPackageCalculatorInputs): Record<string, number> {
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

export function calculateEnergySavingsPackageCalculator(inputs: EnergySavingsPackageCalculatorInputs): {
  annualSavingsCost: number;
  monthlySavingsCost: number;
  paybackYears: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "annualSavingsCost";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "annualSavingsCost";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateEnergySavingsPackageCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.annualSavingsCost ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    annualSavingsCost: computed.annualSavingsCost,
    monthlySavingsCost: computed.monthlySavingsCost,
    paybackYears: computed.paybackYears,
    summaryLevel,
    primaryDriver: "annualSavingsCost",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "annualSavingsCost",
      message,
    },
    warnings: [...validation.warnings],
  };
}
