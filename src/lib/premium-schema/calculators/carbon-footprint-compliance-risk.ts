import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateCarbonFootprintComplianceRiskInputs,
  type CarbonFootprintComplianceRiskInputs,
} from "@/lib/premium-schema/calculators/carbon-footprint-compliance-risk-validation";

export type { CarbonFootprintComplianceRiskInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "carbon.total_emissions",
    "inputMap": {
      "energyEmissionsTon": "energyEmissionsTon",
      "fuelEmissionsTon": "fuelEmissionsTon"
    },
    "outputId": "totalEmissions"
  },
  {
    "formulaId": "carbon.cbam_exposure",
    "inputMap": {
      "emissionsTon": "totalEmissions",
      "carbonPrice": "carbonPrice",
      "exposurePercent": "exposurePercent"
    },
    "outputId": "carbonExposure"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.1;

const SUMMARY_WARNING_THRESHOLD = 5000;
const SUMMARY_CRITICAL_THRESHOLD = 20000;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: CarbonFootprintComplianceRiskInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof CarbonFootprintComplianceRiskInputs] as number;
}

function runFormulaPipeline(inputs: CarbonFootprintComplianceRiskInputs): Record<string, number> {
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

export function calculateCarbonFootprintComplianceRisk(inputs: CarbonFootprintComplianceRiskInputs): {
  carbonExposure: number;
  totalEmissions: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "carbonExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "carbonExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateCarbonFootprintComplianceRiskInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.carbonExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    carbonExposure: computed.carbonExposure,
    totalEmissions: computed.totalEmissions,
    summaryLevel,
    primaryDriver: "carbonExposure",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "carbonExposure",
      message,
    },
    warnings: [...validation.warnings],
  };
}
