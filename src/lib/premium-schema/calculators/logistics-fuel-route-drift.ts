import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateLogisticsFuelRouteDriftInputs,
  type LogisticsFuelRouteDriftInputs,
} from "@/lib/premium-schema/calculators/logistics-fuel-route-drift-validation";

export type { LogisticsFuelRouteDriftInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "route.distance_drift_cost",
    "inputMap": {
      "plannedDistanceKm": "plannedDistanceKm",
      "actualDistanceKm": "actualDistanceKm",
      "fuelCostPerKm": "fuelCostPerKm"
    },
    "outputId": "distanceDriftCost"
  },
  {
    "formulaId": "time.labor_cost",
    "inputMap": {
      "hourlyCost": "hourlyCost",
      "lossHours": "idleHours"
    },
    "outputId": "idleCost"
  },
  {
    "formulaId": "cost.sum2",
    "inputMap": {
      "a": "distanceDriftCost",
      "b": "idleCost"
    },
    "outputId": "totalExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.07;

const SUMMARY_WARNING_THRESHOLD = 3;
const SUMMARY_CRITICAL_THRESHOLD = 8;
const SUMMARY_DIRECTION = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: LogisticsFuelRouteDriftInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof LogisticsFuelRouteDriftInputs] as number;
}

function runFormulaPipeline(inputs: LogisticsFuelRouteDriftInputs): Record<string, number> {
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

export function calculateLogisticsFuelRouteDrift(inputs: LogisticsFuelRouteDriftInputs): {
  totalExposure: number;
  distanceDriftCost: number;
  idleCost: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "totalExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "totalExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateLogisticsFuelRouteDriftInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    totalExposure: computed.totalExposure,
    distanceDriftCost: computed.distanceDriftCost,
    idleCost: computed.idleCost,
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
