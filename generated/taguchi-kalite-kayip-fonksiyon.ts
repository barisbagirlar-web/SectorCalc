// Auto-generated from taguchi-kalite-kayip-fonksiyon-schema.json
import * as z from 'zod';

export interface Taguchi_kalite_kayip_fonksiyonInput {
  ActualValue: number;
  TargetValue: number;
  CostAtTolerance: number;
  Tolerance: number;
  Variance: number;
  Mean: number;
  Target: number;
  AnnualProduction: number;
  y_i: number;
  n: number;
  OldAverageLoss: number;
  NewAverageLoss: number;
  dataConfidence?: number;
}

export const Taguchi_kalite_kayip_fonksiyonInputSchema = z.object({
  ActualValue: z.number().min(0).default(0),
  TargetValue: z.number().min(0).default(0),
  CostAtTolerance: z.number().min(0).default(0),
  Tolerance: z.number().min(0).default(0),
  Variance: z.number().min(0).default(0),
  Mean: z.number().min(0).default(0),
  Target: z.number().min(0).default(0),
  AnnualProduction: z.number().min(0).default(0),
  y_i: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  OldAverageLoss: z.number().min(0).default(0),
  NewAverageLoss: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Taguchi_kalite_kayip_fonksiyonInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (toNumericFormulaValue(results["k"])) * (input.ActualValue - input.TargetValue)**2; results["LossPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LossPerUnit"] = Number.NaN; }
  try { const v = input.CostAtTolerance / input.Tolerance**2; results["k"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["k"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["k"])) * (input.Variance + (input.Mean - input.Target)**2); results["AverageLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AverageLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AverageLoss"])) * input.AnnualProduction; results["TotalAnnualLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalAnnualLoss"] = Number.NaN; }
  results["SignalToNoise_LargerBetter"] = Number.NaN;
  results["SignalToNoise_SmallerBetter"] = Number.NaN;
  try { const v = (input.OldAverageLoss - input.NewAverageLoss) * input.AnnualProduction; results["QualityImprovementSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QualityImprovementSavings"] = Number.NaN; }
  return results;
}


export function calculateTaguchi_kalite_kayip_fonksiyon(input: Taguchi_kalite_kayip_fonksiyonInput): Taguchi_kalite_kayip_fonksiyonOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["QualityImprovementSavings"]);
  const breakdown = {
    LossPerUnit: toNumericFormulaValue(values["LossPerUnit"]),
    k: toNumericFormulaValue(values["k"]),
    AverageLoss: toNumericFormulaValue(values["AverageLoss"]),
    TotalAnnualLoss: toNumericFormulaValue(values["TotalAnnualLoss"]),
    SignalToNoise_LargerBetter: toNumericFormulaValue(values["SignalToNoise_LargerBetter"]),
    SignalToNoise_SmallerBetter: toNumericFormulaValue(values["SignalToNoise_SmallerBetter"]),
    QualityImprovementSavings: toNumericFormulaValue(values["QualityImprovementSavings"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Taguchi_kalite_kayip_fonksiyonOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { LossPerUnit: number; k: number; AverageLoss: number; TotalAnnualLoss: number; SignalToNoise_LargerBetter: number; SignalToNoise_SmallerBetter: number; QualityImprovementSavings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Taguchi_kalite_kayip_fonksiyonOutputMeta = {
  primaryKey: "QualityImprovementSavings",
  unit: "USD",
  breakdownKeys: ["LossPerUnit","k","AverageLoss","TotalAnnualLoss","SignalToNoise_LargerBetter","SignalToNoise_SmallerBetter","QualityImprovementSavings"],
} as const;

