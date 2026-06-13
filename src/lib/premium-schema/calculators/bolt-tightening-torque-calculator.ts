import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateBoltTighteningTorqueCalculatorInputs,
  type BoltTighteningTorqueCalculatorInputs,
} from "@/lib/premium-schema/calculators/bolt-tightening-torque-calculator-validation";

export type { BoltTighteningTorqueCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "measurement.bolt_tightening_torque",
    "inputMap": {
      "clampForceKn": "clampForceKn",
      "boltDiameterMm": "boltDiameterMm",
      "frictionFactor": "frictionFactor"
    },
    "outputId": "torqueNm"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 80;
const SUMMARY_CRITICAL_THRESHOLD = 200;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: BoltTighteningTorqueCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof BoltTighteningTorqueCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: BoltTighteningTorqueCalculatorInputs): Record<string, number> {
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

export function calculateBoltTighteningTorqueCalculator(inputs: BoltTighteningTorqueCalculatorInputs): {
  torqueNm: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "torqueNm";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "torqueNm";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateBoltTighteningTorqueCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.torqueNm ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    torqueNm: computed.torqueNm,
    summaryLevel,
    primaryDriver: "torqueNm",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "torqueNm",
      message,
    },
    warnings: [...validation.warnings],
  };
}
