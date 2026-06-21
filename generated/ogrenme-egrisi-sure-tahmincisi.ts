// Auto-generated from ogrenme-egrisi-sure-tahmincisi-schema.json
import * as z from 'zod';

export interface Ogrenme_egrisi_sure_tahmincisiInput {
  Time_2N: number;
  Time_1: number;
  N: number;
  b: number;
  LaborRate: number;
  StandardTime: number;
  reached: number;
  dataConfidence?: number;
}

export const Ogrenme_egrisi_sure_tahmincisiInputSchema = z.object({
  Time_2N: z.number().min(0).default(0),
  Time_1: z.number().min(0).default(0),
  N: z.number().min(0).default(0),
  b: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  StandardTime: z.number().min(0).default(0),
  reached: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ogrenme_egrisi_sure_tahmincisiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - (input.Time_2N / (toNumericFormulaValue(results["Time_N"]))); results["LearningRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LearningRate"] = Number.NaN; }
  try { const v = Math.log((toNumericFormulaValue(results["LearningRate"]))) / Math.log(2); results["Slope_b"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Slope_b"] = Number.NaN; }
  try { const v = input.Time_1 * (input.N^input.b); results["Time_N"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Time_N"] = Number.NaN; }
  try { const v = input.Time_1 * (input.N^(input.b+1)) / (input.b+1); results["CumulativeTime_N"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CumulativeTime_N"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CumulativeTime_N"])) / input.N; results["AverageTime_N"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AverageTime_N"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Time_N"])) * input.LaborRate; results["Cost_N"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_N"] = Number.NaN; }
  results["BreakevenUnit"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["CumulativeTime_N"])) * input.LaborRate; results["TotalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalLaborCost"] = Number.NaN; }
  return results;
}


export function calculateOgrenme_egrisi_sure_tahmincisi(input: Ogrenme_egrisi_sure_tahmincisiInput): Ogrenme_egrisi_sure_tahmincisiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalLaborCost"]);
  const breakdown = {
    LearningRate: toNumericFormulaValue(values["LearningRate"]),
    Slope_b: toNumericFormulaValue(values["Slope_b"]),
    Time_N: toNumericFormulaValue(values["Time_N"]),
    CumulativeTime_N: toNumericFormulaValue(values["CumulativeTime_N"]),
    AverageTime_N: toNumericFormulaValue(values["AverageTime_N"]),
    Cost_N: toNumericFormulaValue(values["Cost_N"]),
    BreakevenUnit: toNumericFormulaValue(values["BreakevenUnit"]),
    TotalLaborCost: toNumericFormulaValue(values["TotalLaborCost"])
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


export interface Ogrenme_egrisi_sure_tahmincisiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { LearningRate: number; Slope_b: number; Time_N: number; CumulativeTime_N: number; AverageTime_N: number; Cost_N: number; BreakevenUnit: number; TotalLaborCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ogrenme_egrisi_sure_tahmincisiOutputMeta = {
  primaryKey: "TotalLaborCost",
  unit: "USD",
  breakdownKeys: ["LearningRate","Slope_b","Time_N","CumulativeTime_N","AverageTime_N","Cost_N","BreakevenUnit","TotalLaborCost"],
} as const;

