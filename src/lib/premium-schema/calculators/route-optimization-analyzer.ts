import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateRouteOptimizationAnalyzerInputs,
  type RouteOptimizationAnalyzerInputs,
} from "@/lib/premium-schema/calculators/route-optimization-analyzer-validation";

export type { RouteOptimizationAnalyzerInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "route.deadhead_cost",
    "inputMap": {
      "distanceKm": "distanceKm",
      "costPerKm": "costPerKm",
      "emptyReturnPercent": "emptyReturnPercent"
    },
    "outputId": "deadheadCost"
  },
  {
    "formulaId": "loss.time_cost",
    "inputMap": {
      "hourlyCost": "driverRate",
      "lossHours": "driverHours"
    },
    "outputId": "driverCost"
  },
  {
    "formulaId": "energy.kwh_cost",
    "inputMap": {
      "kwh": "distanceKm",
      "rate": "costPerKm"
    },
    "outputId": "fuelCost"
  },
  {
    "formulaId": "route.total_freight_cost",
    "inputMap": {
      "fuelCost": "fuelCost",
      "driverCost": "driverCost",
      "tolls": "tolls",
      "deadheadCost": "deadheadCost"
    },
    "outputId": "totalFreightCost"
  },
  {
    "formulaId": "loss.total_exposure",
    "inputMap": {
      "baseCost": "totalFreightCost",
      "hiddenMultiplier": "hiddenMultiplierConst"
    },
    "outputId": "totalExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.1;

const SUMMARY_WARNING_THRESHOLD = 80;
const SUMMARY_CRITICAL_THRESHOLD = 150;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: RouteOptimizationAnalyzerInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof RouteOptimizationAnalyzerInputs] as number;
}

function runFormulaPipeline(inputs: RouteOptimizationAnalyzerInputs): Record<string, number> {
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

export function calculateRouteOptimizationAnalyzer(inputs: RouteOptimizationAnalyzerInputs): {
  deadheadCost: number;
  driverCost: number;
  totalFreightCost: number;
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
  const validation = validateRouteOptimizationAnalyzerInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    deadheadCost: computed.deadheadCost,
    driverCost: computed.driverCost,
    totalFreightCost: computed.totalFreightCost,
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
