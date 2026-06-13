import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateProductCustomerProfitabilityCalculatorInputs,
  type ProductCustomerProfitabilityCalculatorInputs,
} from "@/lib/premium-schema/calculators/product-customer-profitability-calculator-validation";

export type { ProductCustomerProfitabilityCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "directCost",
      "b": "serviceCost",
      "c": "returnsCost"
    },
    "outputId": "loadedCost"
  },
  {
    "formulaId": "cost.difference",
    "inputMap": {
      "a": "revenue",
      "b": "loadedCost"
    },
    "outputId": "contributionAmount"
  },
  {
    "formulaId": "cost.margin_rate_on_price",
    "inputMap": {
      "price": "revenue",
      "cost": "loadedCost"
    },
    "outputId": "contributionMarginRate"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.04;

const SUMMARY_WARNING_THRESHOLD = 1;
const SUMMARY_CRITICAL_THRESHOLD = 3;
const SUMMARY_DIRECTION = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: ProductCustomerProfitabilityCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof ProductCustomerProfitabilityCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: ProductCustomerProfitabilityCalculatorInputs): Record<string, number> {
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

export function calculateProductCustomerProfitabilityCalculator(inputs: ProductCustomerProfitabilityCalculatorInputs): {
  contributionMarginRate: number;
  contributionAmount: number;
  loadedCost: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "contributionMarginRate";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "contributionMarginRate";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateProductCustomerProfitabilityCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.contributionMarginRate ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    contributionMarginRate: computed.contributionMarginRate,
    contributionAmount: computed.contributionAmount,
    loadedCost: computed.loadedCost,
    summaryLevel,
    primaryDriver: "contributionMarginRate",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "contributionMarginRate",
      message,
    },
    warnings: [...validation.warnings],
  };
}
