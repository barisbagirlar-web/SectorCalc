import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateBeltPulleySpeedLengthCalculatorInputs,
  type BeltPulleySpeedLengthCalculatorInputs,
} from "@/lib/premium-schema/calculators/belt-pulley-speed-length-calculator-validation";

export type { BeltPulleySpeedLengthCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "measurement.pulley_driven_rpm",
    "inputMap": {
      "driverRpm": "driverRpm",
      "driverDiameterMm": "driverDiameterMm",
      "drivenDiameterMm": "drivenDiameterMm"
    },
    "outputId": "drivenRpm"
  },
  {
    "formulaId": "measurement.belt_speed_mpm",
    "inputMap": {
      "driverDiameterMm": "driverDiameterMm",
      "driverRpm": "driverRpm"
    },
    "outputId": "beltSpeedMpm"
  },
  {
    "formulaId": "measurement.open_belt_length_mm",
    "inputMap": {
      "driverDiameterMm": "driverDiameterMm",
      "drivenDiameterMm": "drivenDiameterMm",
      "centerDistanceMm": "centerDistanceMm"
    },
    "outputId": "beltLengthMm"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1;

const SUMMARY_WARNING_THRESHOLD = 3600;
const SUMMARY_CRITICAL_THRESHOLD = 6000;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: BeltPulleySpeedLengthCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof BeltPulleySpeedLengthCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: BeltPulleySpeedLengthCalculatorInputs): Record<string, number> {
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

export function calculateBeltPulleySpeedLengthCalculator(inputs: BeltPulleySpeedLengthCalculatorInputs): {
  drivenRpm: number;
  beltSpeedMpm: number;
  beltLengthMm: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "drivenRpm";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "drivenRpm";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateBeltPulleySpeedLengthCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.drivenRpm ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    drivenRpm: computed.drivenRpm,
    beltSpeedMpm: computed.beltSpeedMpm,
    beltLengthMm: computed.beltLengthMm,
    summaryLevel,
    primaryDriver: "drivenRpm",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "drivenRpm",
      message,
    },
    warnings: [...validation.warnings],
  };
}
