import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateFireSystemFlowHydrantCalculatorInputs,
  type FireSystemFlowHydrantCalculatorInputs,
} from "@/lib/premium-schema/calculators/fire-system-flow-hydrant-calculator-validation";

export type { FireSystemFlowHydrantCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "measurement.fire_flow_demand",
    "inputMap": {
      "protectedAreaM2": "protectedAreaM2",
      "designDensityLpmM2": "designDensityLpmM2"
    },
    "outputId": "flowDemandLpm"
  },
  {
    "formulaId": "measurement.hydrant_count",
    "inputMap": {
      "flowDemandLpm": "flowDemandLpm",
      "hydrantCapacityLpm": "hydrantCapacityLpm"
    },
    "outputId": "hydrantCount"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 8000;
const SUMMARY_CRITICAL_THRESHOLD = 15000;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: FireSystemFlowHydrantCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof FireSystemFlowHydrantCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: FireSystemFlowHydrantCalculatorInputs): Record<string, number> {
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

export function calculateFireSystemFlowHydrantCalculator(inputs: FireSystemFlowHydrantCalculatorInputs): {
  flowDemandLpm: number;
  hydrantCount: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "flowDemandLpm";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "flowDemandLpm";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateFireSystemFlowHydrantCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.flowDemandLpm ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    flowDemandLpm: computed.flowDemandLpm,
    hydrantCount: computed.hydrantCount,
    summaryLevel,
    primaryDriver: "flowDemandLpm",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "flowDemandLpm",
      message,
    },
    warnings: [...validation.warnings],
  };
}
