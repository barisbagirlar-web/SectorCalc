import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateShopRateHourlyCostCalculatorInputs,
  type ShopRateHourlyCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/shop-rate-hourly-cost-calculator-validation";

export type { ShopRateHourlyCostCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "cost.shop_hourly_rate",
    "inputMap": {
      "fixedMonthlyCost": "fixedMonthlyCost",
      "monthlyMachineHours": "monthlyMachineHours",
      "variableCostPerHour": "variableCostPerHour"
    },
    "outputId": "hourlyRate"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.03;

const SUMMARY_WARNING_THRESHOLD = 45;
const SUMMARY_CRITICAL_THRESHOLD = 30;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "lower_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: ShopRateHourlyCostCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof ShopRateHourlyCostCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: ShopRateHourlyCostCalculatorInputs): Record<string, number> {
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

export function calculateShopRateHourlyCostCalculator(inputs: ShopRateHourlyCostCalculatorInputs): {
  hourlyRate: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "hourlyRate";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "hourlyRate";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateShopRateHourlyCostCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.hourlyRate ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    hourlyRate: computed.hourlyRate,
    summaryLevel,
    primaryDriver: "hourlyRate",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "hourlyRate",
      message,
    },
    warnings: [...validation.warnings],
  };
}
