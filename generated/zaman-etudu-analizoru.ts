// Auto-generated from zaman-etudu-analizoru-schema.json
import * as z from 'zod';

export interface Zaman_etudu_analizoruInput {
  CycleTimes: number;
  NumberOfCycles: number;
  PerformanceRating: number;
  Personal: number;
  Fatigue: number;
  Delay: number;
  ShiftDuration: number;
  HourlyRate: number;
  ActualTime: number;
  ActualProduction: number;
  dataConfidence?: number;
}

export const Zaman_etudu_analizoruInputSchema = z.object({
  CycleTimes: z.number().min(0).default(0),
  NumberOfCycles: z.number().min(0).default(0),
  PerformanceRating: z.number().min(0).default(0),
  Personal: z.number().min(0).default(0),
  Fatigue: z.number().min(0).default(0),
  Delay: z.number().min(0).default(0),
  ShiftDuration: z.number().min(0).default(0),
  HourlyRate: z.number().min(0).default(0),
  ActualTime: z.number().min(0).default(0),
  ActualProduction: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Zaman_etudu_analizoruInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["ObservedTime"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["ObservedTime"])) * input.PerformanceRating; results["NormalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NormalTime"] = Number.NaN; }
  try { const v = input.Personal + input.Fatigue + input.Delay; results["AllowancePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AllowancePct"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["NormalTime"])) * (1 + (toNumericFormulaValue(results["AllowancePct"]))); results["StandardTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StandardTime"] = Number.NaN; }
  try { const v = input.ShiftDuration / (toNumericFormulaValue(results["StandardTime"])); results["StandardOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StandardOutput"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["StandardTime"])) * input.HourlyRate; results["LaborCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborCostPerUnit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["StandardTime"])) - input.ActualTime) * input.ActualProduction * input.HourlyRate; results["EfficiencyVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EfficiencyVariance"] = Number.NaN; }
  return results;
}


export function calculateZaman_etudu_analizoru(input: Zaman_etudu_analizoruInput): Zaman_etudu_analizoruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["EfficiencyVariance"]);
  const breakdown = {
    ObservedTime: toNumericFormulaValue(values["ObservedTime"]),
    NormalTime: toNumericFormulaValue(values["NormalTime"]),
    AllowancePct: toNumericFormulaValue(values["AllowancePct"]),
    StandardTime: toNumericFormulaValue(values["StandardTime"]),
    StandardOutput: toNumericFormulaValue(values["StandardOutput"]),
    LaborCostPerUnit: toNumericFormulaValue(values["LaborCostPerUnit"]),
    EfficiencyVariance: toNumericFormulaValue(values["EfficiencyVariance"])
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


export interface Zaman_etudu_analizoruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ObservedTime: number; NormalTime: number; AllowancePct: number; StandardTime: number; StandardOutput: number; LaborCostPerUnit: number; EfficiencyVariance: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Zaman_etudu_analizoruOutputMeta = {
  primaryKey: "EfficiencyVariance",
  unit: "USD",
  breakdownKeys: ["ObservedTime","NormalTime","AllowancePct","StandardTime","StandardOutput","LaborCostPerUnit","EfficiencyVariance"],
} as const;

