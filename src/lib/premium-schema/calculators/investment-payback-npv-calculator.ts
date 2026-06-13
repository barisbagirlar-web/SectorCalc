import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateInvestmentPaybackNpvCalculatorInputs,
  type InvestmentPaybackNpvCalculatorInputs,
} from "@/lib/premium-schema/calculators/investment-payback-npv-calculator-validation";

export type { InvestmentPaybackNpvCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "finance.simple_npv",
    "inputMap": {
      "initialInvestment": "initialInvestment",
      "annualCashFlow": "annualCashFlow",
      "discountRatePercent": "discountRatePercent",
      "horizonYears": "horizonYears"
    },
    "outputId": "npv"
  },
  {
    "formulaId": "finance.payback_years",
    "inputMap": {
      "initialInvestment": "initialInvestment",
      "annualSavings": "annualCashFlow"
    },
    "outputId": "paybackYears"
  },
  {
    "formulaId": "finance.annual_yield_percent",
    "inputMap": {
      "initialInvestment": "initialInvestment",
      "annualCashFlow": "annualCashFlow"
    },
    "outputId": "firstYearYieldPercent"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 0;
const SUMMARY_CRITICAL_THRESHOLD = -25000;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "lower_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: InvestmentPaybackNpvCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof InvestmentPaybackNpvCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: InvestmentPaybackNpvCalculatorInputs): Record<string, number> {
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

export function calculateInvestmentPaybackNpvCalculator(inputs: InvestmentPaybackNpvCalculatorInputs): {
  npv: number;
  paybackYears: number;
  firstYearYieldPercent: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "npv";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "npv";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateInvestmentPaybackNpvCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.npv ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    npv: computed.npv,
    paybackYears: computed.paybackYears,
    firstYearYieldPercent: computed.firstYearYieldPercent,
    summaryLevel,
    primaryDriver: "npv",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "npv",
      message,
    },
    warnings: [...validation.warnings],
  };
}
