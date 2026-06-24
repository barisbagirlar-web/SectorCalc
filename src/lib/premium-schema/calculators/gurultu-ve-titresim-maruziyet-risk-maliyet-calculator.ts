import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validateGurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs,
  type GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs,
} from "@/lib/premium-schema/calculators/gurultu-ve-titresim-maruziyet-risk-maliyet-calculator-validation";

export type { GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = [
  {
    formulaId: "measurement.noise_exposure",
    inputMap: {
      soundLevelDb: "soundLevelDb",
      exposureDuration: "exposureDuration",
    },
    outputId: "noiseExposureIndex",
  },
  {
    formulaId: "cost.sum4",
    inputMap: {
      a: "hearingLossCost",
      b: "efficiencyLossCost",
      c: "errorRateCost",
      d: "ppeCost",
    },
    outputId: "totalNoiseCost",
  },
] as const;

const SUMMARY_WARNING_THRESHOLD = 680;
const SUMMARY_CRITICAL_THRESHOLD = 720;
const summaryDirection: "lower_is_bad" | "higher_is_bad" = "higher_is_bad";

function resolveMappedValue(
  sourceKey: string,
  userInputs: GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs] as number;
}

function runFormulaPipeline(
  inputs: GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs,
): Record<string, number> {
  const computed: Record<string, number> = {};

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
    return "Gürültü maruziyeti güvenli sınırlar içerisinde. Mevcut koruma planına devam ediniz.";
  }
  if (summaryLevel === "warning") {
    return "Gürültü maruziyeti sınır değere yakın. Kulak koruyucu kullanımı ve rotasyon planlamasını gözden geçirin.";
  }
  return "Kritik gürültü maruziyeti! Acil mühendislik kontrolü, gürültü kaynağında yalıtım ve kulak koruması zorunludur.";
}

export function calculateGurultuVeTitresimMaruziyetRiskMaliyetCalculator(
  inputs: GurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs,
): {
  noiseExposureIndex: number;
  totalNoiseCost: number;
  summaryLevel: SummaryLevel;
  primaryDriver: "noiseExposureIndex";
  decisionVerdict: {
    summaryLevel: SummaryLevel;
    primaryDriver: "noiseExposureIndex";
    message: string;
  };
  warnings: string[];
} {
  const validation = validateGurultuVeTitresimMaruziyetRiskMaliyetCalculatorInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.noiseExposureIndex ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
    noiseExposureIndex: computed.noiseExposureIndex ?? 0,
    totalNoiseCost: computed.totalNoiseCost ?? 0,
    summaryLevel,
    primaryDriver: "noiseExposureIndex",
    decisionVerdict: {
      summaryLevel,
      primaryDriver: "noiseExposureIndex",
      message,
    },
    warnings: [...validation.warnings],
  };
}
