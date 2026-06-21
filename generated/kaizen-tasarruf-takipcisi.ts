// Auto-generated from kaizen-tasarruf-takipcisi-schema.json
import * as z from 'zod';

export interface Kaizen_tasarruf_takipcisiInput {
  Baseline: number;
  Actual: number;
  Vol: number;
  TimeSaved: number;
  LabRate: number;
  Conv: number;
  Lab_K: number;
  Mat: number;
  Down: number;
  MonthSav: number;
  Sav_M6: number;
  Sav_M1: number;
  Time_K: number;
  ProdRate: number;
  Margin: number;
  dataConfidence?: number;
}

export const Kaizen_tasarruf_takipcisiInputSchema = z.object({
  Baseline: z.number().min(0).default(0),
  Actual: z.number().min(0).default(0),
  Vol: z.number().min(0).default(0),
  TimeSaved: z.number().min(0).default(0),
  LabRate: z.number().min(0).default(0),
  Conv: z.number().min(0).default(0),
  Lab_K: z.number().min(0).default(0),
  Mat: z.number().min(0).default(0),
  Down: z.number().min(0).default(0),
  MonthSav: z.number().min(0).default(0),
  Sav_M6: z.number().min(0).default(0),
  Sav_M1: z.number().min(0).default(0),
  Time_K: z.number().min(0).default(0),
  ProdRate: z.number().min(0).default(0),
  Margin: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kaizen_tasarruf_takipcisiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.Baseline - input.Actual) * input.Vol; results["Hard"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Hard"] = Number.NaN; }
  try { const v = input.TimeSaved * input.LabRate * input.Conv; results["Soft"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Soft"] = Number.NaN; }
  try { const v = input.Lab_K + input.Mat + input.Down; results["ImpCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ImpCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["Hard"])) + (toNumericFormulaValue(results["Soft"])) - (toNumericFormulaValue(results["ImpCost"]))) / (toNumericFormulaValue(results["ImpCost"])); results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ImpCost"])) / input.MonthSav; results["Payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Payback"] = Number.NaN; }
  try { const v = input.Sav_M6 / input.Sav_M1; results["Sust"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Sust"] = Number.NaN; }
  results["Cum"] = Number.NaN;
  try { const v = input.Time_K * input.ProdRate * input.Margin; results["Opp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Opp"] = Number.NaN; }
  return results;
}


export function calculateKaizen_tasarruf_takipcisi(input: Kaizen_tasarruf_takipcisiInput): Kaizen_tasarruf_takipcisiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Opp"]);
  const breakdown = {
    Hard: toNumericFormulaValue(values["Hard"]),
    Soft: toNumericFormulaValue(values["Soft"]),
    ImpCost: toNumericFormulaValue(values["ImpCost"]),
    ROI: toNumericFormulaValue(values["ROI"]),
    Payback: toNumericFormulaValue(values["Payback"]),
    Sust: toNumericFormulaValue(values["Sust"]),
    Cum: toNumericFormulaValue(values["Cum"]),
    Opp: toNumericFormulaValue(values["Opp"])
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


export interface Kaizen_tasarruf_takipcisiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Hard: number; Soft: number; ImpCost: number; ROI: number; Payback: number; Sust: number; Cum: number; Opp: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kaizen_tasarruf_takipcisiOutputMeta = {
  primaryKey: "Opp",
  unit: "USD",
  breakdownKeys: ["Hard","Soft","ImpCost","ROI","Payback","Sust","Cum","Opp"],
} as const;

