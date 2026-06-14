import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateHeatLossCalculatorInputs,
  type HeatLossCalculatorInputs,
} from "@/lib/premium-schema/calculators/heat-loss-calculator-validation";

export type { HeatLossCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "benchmark.variance_percent",
    "inputMap": {
      "actual": "currentKwh",
      "target": "targetKwh"
    },
    "outputId": "kwhVariancePercent"
  },
  {
    "formulaId": "energy.excess_kwh_cost",
    "inputMap": {
      "currentKwh": "currentKwh",
      "targetKwh": "targetKwh",
      "rate": "energyRate"
    },
    "outputId": "excessKwhCost"
  },
  {
    "formulaId": "energy.peak_demand_cost",
    "inputMap": {
      "peakKwh": "peakKwh",
      "peakRate": "peakRate",
      "demandCharge": "demandCharge"
    },
    "outputId": "peakCost"
  },
  {
    "formulaId": "energy.total_energy_cost",
    "inputMap": {
      "excessKwh": "excessKwhDerived",
      "energyRate": "energyRate",
      "peakCost": "peakCost"
    },
    "outputId": "totalEnergyCost"
  },
  {
    "formulaId": "loss.total_exposure",
    "inputMap": {
      "baseCost": "totalEnergyCost",
      "hiddenMultiplier": "hiddenMultiplierConst"
    },
    "outputId": "totalExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.08;

const SUMMARY_WARNING_THRESHOLD = 10;
const SUMMARY_CRITICAL_THRESHOLD = 20;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: HeatLossCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof HeatLossCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: HeatLossCalculatorInputs): Record<string, number> {
  const computed: Record<string, number> = {
    hiddenMultiplierConst: HIDDEN_LOSS_MULTIPLIER,
  };

  computed.excessKwhDerived = Math.max(0, inputs.currentKwh - inputs.targetKwh);

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

export function calculateHeatLossCalculator(inputs: HeatLossCalculatorInputs): {
  kwhVariancePercent: number;
  excessKwhCost: number;
  peakCost: number;
  totalExposure: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateHeatLossCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    kwhVariancePercent: computed.kwhVariancePercent,
    excessKwhCost: computed.excessKwhCost,
    peakCost: computed.peakCost,
    totalExposure: computed.totalExposure,
    summaryLevel,
    primaryDriver: "totalExposure",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "totalExposure",
      message,
    },
    warnings: [...validation.warnings],
  };
}
