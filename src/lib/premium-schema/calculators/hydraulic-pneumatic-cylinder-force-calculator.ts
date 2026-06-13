import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateHydraulicPneumaticCylinderForceCalculatorInputs,
  type HydraulicPneumaticCylinderForceCalculatorInputs,
} from "@/lib/premium-schema/calculators/hydraulic-pneumatic-cylinder-force-calculator-validation";

export type { HydraulicPneumaticCylinderForceCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "measurement.cylinder_force",
    "inputMap": {
      "pressureBar": "pressureBar",
      "boreMm": "boreMm"
    },
    "outputId": "extendForceN"
  },
  {
    "formulaId": "measurement.cylinder_retract_force",
    "inputMap": {
      "pressureBar": "pressureBar",
      "boreMm": "boreMm",
      "rodMm": "rodMm"
    },
    "outputId": "retractForceN"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 15000;
const SUMMARY_CRITICAL_THRESHOLD = 40000;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: HydraulicPneumaticCylinderForceCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof HydraulicPneumaticCylinderForceCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: HydraulicPneumaticCylinderForceCalculatorInputs): Record<string, number> {
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

export function calculateHydraulicPneumaticCylinderForceCalculator(inputs: HydraulicPneumaticCylinderForceCalculatorInputs): {
  extendForceN: number;
  retractForceN: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "extendForceN";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "extendForceN";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateHydraulicPneumaticCylinderForceCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.extendForceN ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    extendForceN: computed.extendForceN,
    retractForceN: computed.retractForceN,
    summaryLevel,
    primaryDriver: "extendForceN",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "extendForceN",
      message,
    },
    warnings: [...validation.warnings],
  };
}
