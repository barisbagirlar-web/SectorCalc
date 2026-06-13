import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateOeeEquipmentEffectivenessCalculatorInputs,
  type OeeEquipmentEffectivenessCalculatorInputs,
} from "@/lib/premium-schema/calculators/oee-equipment-effectiveness-calculator-validation";

export type { OeeEquipmentEffectivenessCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "oee.basic",
    "inputMap": {
      "availability": "availability",
      "performance": "performance",
      "quality": "quality"
    },
    "outputId": "oeeScore"
  },
  {
    "formulaId": "oee.availability_loss_cost",
    "inputMap": {
      "machineRate": "machineRate",
      "downtimeHours": "downtimeHours",
      "plannedHours": "plannedHours"
    },
    "outputId": "availabilityLossCost"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.05;

const SUMMARY_WARNING_THRESHOLD = 65;
const SUMMARY_CRITICAL_THRESHOLD = 50;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "lower_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: OeeEquipmentEffectivenessCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof OeeEquipmentEffectivenessCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: OeeEquipmentEffectivenessCalculatorInputs): Record<string, number> {
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

export function calculateOeeEquipmentEffectivenessCalculator(inputs: OeeEquipmentEffectivenessCalculatorInputs): {
  oeeScore: number;
  availabilityLossCost: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "oeeScore";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "oeeScore";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateOeeEquipmentEffectivenessCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.oeeScore ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    oeeScore: computed.oeeScore,
    availabilityLossCost: computed.availabilityLossCost,
    summaryLevel,
    primaryDriver: "oeeScore",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "oeeScore",
      message,
    },
    warnings: [...validation.warnings],
  };
}
