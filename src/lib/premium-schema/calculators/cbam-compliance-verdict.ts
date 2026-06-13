import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateCbamComplianceVerdictInputs,
  type CbamComplianceVerdictInputs,
} from "@/lib/premium-schema/calculators/cbam-compliance-verdict-validation";

export type { CbamComplianceVerdictInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    "formulaId": "carbon.emission_gap_ton",
    "inputMap": {
      "embeddedEmissionsTon": "embeddedEmissionsTon",
      "declaredEmissionsTon": "declaredEmissionsTon"
    },
    "outputId": "emissionGap"
  },
  {
    "formulaId": "benchmark.gap_percent",
    "inputMap": {
      "percent": "certificateCoveragePct"
    },
    "outputId": "coverageGapPct"
  },
  {
    "formulaId": "benchmark.gap_percent",
    "inputMap": {
      "percent": "dataCompletenessPct"
    },
    "outputId": "dataGapPct"
  },
  {
    "formulaId": "carbon.cbam_financial_exposure",
    "inputMap": {
      "emissionGap": "emissionGap",
      "cbamCertificatePrice": "cbamCertificatePrice",
      "eurTryRate": "eurTryRate"
    },
    "outputId": "financialExposure"
  },
  {
    "formulaId": "risk.cbam_composite_score",
    "inputMap": {
      "embeddedEmissionsTon": "embeddedEmissionsTon",
      "emissionGap": "emissionGap",
      "coverageGapPct": "coverageGapPct",
      "dataGapPct": "dataGapPct"
    },
    "outputId": "riskScore"
  }
] as const;

const HIDDEN_LOSS_MULTIPLIER = 1.08;

const SUMMARY_WARNING_THRESHOLD = 20;
const SUMMARY_CRITICAL_THRESHOLD = 50;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: CbamComplianceVerdictInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof CbamComplianceVerdictInputs] as number;
}

function runFormulaPipeline(inputs: CbamComplianceVerdictInputs): Record<string, number> {
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

export function calculateCbamComplianceVerdict(inputs: CbamComplianceVerdictInputs): {
  financialExposure: number;
  riskScore: number;
  emissionGap: number;
  coverageGapPct: number;
  dataGapPct: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "financialExposure";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "financialExposure";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateCbamComplianceVerdictInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.financialExposure ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    financialExposure: computed.financialExposure,
    riskScore: computed.riskScore,
    emissionGap: computed.emissionGap,
    coverageGapPct: computed.coverageGapPct,
    dataGapPct: computed.dataGapPct,
    summaryLevel,
    primaryDriver: "financialExposure",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "financialExposure",
      message,
    },
    warnings: [...validation.warnings],
  };
}
