import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateCncQuoteRiskAnalyzerInputs,
  type CncQuoteRiskAnalyzerInputs,
} from "@/lib/premium-schema/calculators/cnc-quote-risk-analyzer-validation";

export type { CncQuoteRiskAnalyzerInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "oee.availability_loss_cost",
    "inputMap": {
      "machineRate": "machineRate",
      "plannedHours": "plannedHours",
      "downtimeHours": "downtimeHours"
    },
    "outputId": "availabilityLossCost"
  },
  {
    "formulaId": "loss.scrap_cost",
    "inputMap": {
      "materialCost": "materialCost",
      "scrapRate": "scrapRate"
    },
    "outputId": "scrapCost"
  },
  {
    "formulaId": "loss.time_cost",
    "inputMap": {
      "hourlyCost": "machineRate",
      "lossHours": "downtimeHours"
    },
    "outputId": "timeLossCost"
  },
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
    "formulaId": "loss.combined_operating",
    "inputMap": {
      "laborCost": "availabilityLossCost",
      "materialCost": "scrapCost",
      "overheadCost": "timeLossCost"
    },
    "outputId": "combinedOperatingCost"
  },
  {
    "formulaId": "loss.total_exposure",
    "inputMap": {
      "baseCost": "combinedOperatingCost",
      "hiddenMultiplier": "hiddenMultiplierConst"
    },
    "outputId": "totalExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.12;

const SUMMARY_WARNING_THRESHOLD = 65;
const SUMMARY_CRITICAL_THRESHOLD = 50;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "lower_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: CncQuoteRiskAnalyzerInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof CncQuoteRiskAnalyzerInputs] as number;
}

function runFormulaPipeline(inputs: CncQuoteRiskAnalyzerInputs): Record<string, number> {
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

export function calculateCncQuoteRiskAnalyzer(inputs: CncQuoteRiskAnalyzerInputs): {
  oeeScore: number;
  availabilityLossCost: number;
  scrapCost: number;
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
  const validation = validateCncQuoteRiskAnalyzerInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.totalExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    oeeScore: computed.oeeScore,
    availabilityLossCost: computed.availabilityLossCost,
    scrapCost: computed.scrapCost,
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
