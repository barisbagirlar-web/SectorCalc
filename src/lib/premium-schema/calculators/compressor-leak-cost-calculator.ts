import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateCompressorLeakCostCalculatorInputs,
  type CompressorLeakCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/compressor-leak-cost-calculator-validation";

export type { CompressorLeakCostCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "energy.compressor_leak_kwh",
    "inputMap": {
      "compressorKw": "compressorKw",
      "leakPercent": "leakPercent",
      "operatingHours": "operatingHours"
    },
    "outputId": "leakKwh"
  },
  {
    "formulaId": "energy.kwh_cost",
    "inputMap": {
      "kwh": "leakKwh",
      "rate": "energyRate"
    },
    "outputId": "monthlyLeakCost"
  },
  {
    "formulaId": "cost.annualize",
    "inputMap": {
      "monthlyCost": "monthlyLeakCost"
    },
    "outputId": "annualLeakCost"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.08;

const SUMMARY_WARNING_THRESHOLD = 1;
const SUMMARY_CRITICAL_THRESHOLD = 3;
const SUMMARY_DIRECTION = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: CompressorLeakCostCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof CompressorLeakCostCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: CompressorLeakCostCalculatorInputs): Record<string, number> {
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

export function calculateCompressorLeakCostCalculator(inputs: CompressorLeakCostCalculatorInputs): {
  annualLeakCost: number;
  monthlyLeakCost: number;
  leakKwh: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "annualLeakCost";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "annualLeakCost";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateCompressorLeakCostCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.annualLeakCost ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    annualLeakCost: computed.annualLeakCost,
    monthlyLeakCost: computed.monthlyLeakCost,
    leakKwh: computed.leakKwh,
    summaryLevel,
    primaryDriver: "annualLeakCost",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "annualLeakCost",
      message,
    },
    warnings: [...validation.warnings],
  };
}
