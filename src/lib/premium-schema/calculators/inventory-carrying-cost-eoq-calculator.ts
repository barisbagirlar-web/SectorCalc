import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateInventoryCarryingCostEoqCalculatorInputs,
  type InventoryCarryingCostEoqCalculatorInputs,
} from "@/lib/premium-schema/calculators/inventory-carrying-cost-eoq-calculator-validation";

export type { InventoryCarryingCostEoqCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "inventory.eoq_units",
    "inputMap": {
      "annualDemand": "annualDemand",
      "orderCost": "orderCost",
      "unitCost": "unitCost",
      "carryingCostPercent": "carryingCostPercent"
    },
    "outputId": "eoqUnits"
  },
  {
    "formulaId": "inventory.carrying_cost_annual",
    "inputMap": {
      "eoqUnits": "eoqUnits",
      "unitCost": "unitCost",
      "carryingCostPercent": "carryingCostPercent"
    },
    "outputId": "annualCarryingCost"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.03;

const SUMMARY_WARNING_THRESHOLD = 1;
const SUMMARY_CRITICAL_THRESHOLD = 3;
const SUMMARY_DIRECTION = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: InventoryCarryingCostEoqCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof InventoryCarryingCostEoqCalculatorInputs] as number;
}

function runFormulaPipeline(inputs: InventoryCarryingCostEoqCalculatorInputs): Record<string, number> {
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

export function calculateInventoryCarryingCostEoqCalculator(inputs: InventoryCarryingCostEoqCalculatorInputs): {
  eoqUnits: number;
  annualCarryingCost: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "eoqUnits";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "eoqUnits";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateInventoryCarryingCostEoqCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.eoqUnits ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    eoqUnits: computed.eoqUnits,
    annualCarryingCost: computed.annualCarryingCost,
    summaryLevel,
    primaryDriver: "eoqUnits",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "eoqUnits",
      message,
    },
    warnings: [...validation.warnings],
  };
}
