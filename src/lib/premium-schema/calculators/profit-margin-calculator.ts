import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateProfitMarginCalculatorInputs,
  type ProfitMarginCalculatorInputs,
} from "@/lib/premium-schema/calculators/profit-margin-calculator-validation";

export type { ProfitMarginCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "materialCost",
      "b": "laborCost",
      "c": "machineCost"
    },
    "outputId": "costStack1"
  },
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "costStack1",
      "b": "energyCost",
      "c": "overheadCost"
    },
    "outputId": "costStack2"
  },
  {
    "formulaId": "cost.total_exposure",
    "inputMap": {
      "a": "costStack2",
      "b": "setupTimeCost",
      "c": "shippingCost"
    },
    "outputId": "costStack3"
  },
  {
    "formulaId": "cost.sum2",
    "inputMap": {
      "a": "costStack3",
      "b": "paymentTermCost"
    },
    "outputId": "directSubtotal"
  },
  {
    "formulaId": "cost.percent_of_amount",
    "inputMap": {
      "amount": "directSubtotal",
      "percent": "wasteRate"
    },
    "outputId": "wasteCost"
  },
  {
    "formulaId": "cost.sum2",
    "inputMap": {
      "a": "directSubtotal",
      "b": "wasteCost"
    },
    "outputId": "totalCost"
  },
  {
    "formulaId": "cost.value",
    "inputMap": {
      "value": "totalCost"
    },
    "outputId": "totalExposure"
  },
  {
    "formulaId": "cost.quote_target_price",
    "inputMap": {
      "totalCost": "totalCost",
      "targetMarginPercent": "targetMarginRate"
    },
    "outputId": "targetSalesPrice"
  },
  {
    "formulaId": "cost.quote_safe_floor_price",
    "inputMap": {
      "totalCost": "totalCost",
      "targetMarginPercent": "targetMarginRate",
      "safetyMarginUplift": "safetyMarginUplift"
    },
    "outputId": "minimumSafePrice"
  },
  {
    "formulaId": "cost.difference",
    "inputMap": {
      "a": "targetSalesPrice",
      "b": "totalCost"
    },
    "outputId": "grossMarginAmount"
  },
  {
    "formulaId": "cost.margin_rate_on_price",
    "inputMap": {
      "price": "targetSalesPrice",
      "cost": "totalCost"
    },
    "outputId": "grossMarginRate"
  },
  {
    "formulaId": "cost.margin_rate_on_price",
    "inputMap": {
      "price": "targetSalesPrice",
      "cost": "totalCost"
    },
    "outputId": "decisionSummary"
  },
  {
    "formulaId": "cost.percent_of_amount",
    "inputMap": {
      "amount": "targetSalesPrice",
      "percent": "discountRate"
    },
    "outputId": "discountImpact"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.05;

const SUMMARY_WARNING_THRESHOLD = 12;
const SUMMARY_CRITICAL_THRESHOLD = 8;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "lower_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: ProfitMarginCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof ProfitMarginCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: ProfitMarginCalculatorInputs): Record<string, number> {
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

export function calculateProfitMarginCalculator(inputs: ProfitMarginCalculatorInputs): {
  targetSalesPrice: number;
  totalCost: number;
  wasteCost: number;
  minimumSafePrice: number;
  grossMarginAmount: number;
  grossMarginRate: number;
  discountImpact: number;
  decisionSummary: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalCost";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalCost";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateProfitMarginCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalCost ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    targetSalesPrice: computed.targetSalesPrice,
    totalCost: computed.totalCost,
    wasteCost: computed.wasteCost,
    minimumSafePrice: computed.minimumSafePrice,
    grossMarginAmount: computed.grossMarginAmount,
    grossMarginRate: computed.grossMarginRate,
    discountImpact: computed.discountImpact,
    decisionSummary: computed.decisionSummary,
    summaryLevel,
    primaryDriver: "totalCost",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalCost",
      message,
    },
    warnings: [...validation.warnings],
  };
}
