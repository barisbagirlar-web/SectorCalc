// Auto-generated from ilerleme-yem-maliyet-schema.json
import * as z from 'zod';

export interface Ilerleme_yem_maliyetInput {
  InclRate: number;
  Price: number;
  Grind: number;
  Mix: number;
  Pellet: number;
  Enz: number;
  Vit: number;
  Tox: number;
  ShrinkRate: number;
  FeedCons: number;
  WeightGain: number;
  Base: number;
  Proc: number;
  Add: number;
  dataConfidence?: number;
}

export const Ilerleme_yem_maliyetInputSchema = z.object({
  InclRate: z.number().min(0).default(0),
  Price: z.number().min(0).default(0),
  Grind: z.number().min(0).default(0),
  Mix: z.number().min(0).default(0),
  Pellet: z.number().min(0).default(0),
  Enz: z.number().min(0).default(0),
  Vit: z.number().min(0).default(0),
  Tox: z.number().min(0).default(0),
  ShrinkRate: z.number().min(0).default(0),
  FeedCons: z.number().min(0).default(0),
  WeightGain: z.number().min(0).default(0),
  Base: z.number().min(0).default(0),
  Proc: z.number().min(0).default(0),
  Add: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ilerleme_yem_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.InclRate * input.Price; results["Cost_Ing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Ing"] = Number.NaN; }
  results["Cost_Base"] = Number.NaN;
  try { const v = input.Grind + input.Mix + input.Pellet; results["Cost_Proc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Proc"] = Number.NaN; }
  results["Cost_Add"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Cost_Base"])) * input.ShrinkRate; results["Shrink"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Shrink"] = Number.NaN; }
  try { const v = input.FeedCons / input.WeightGain; results["FCR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FCR"] = Number.NaN; }
  try { const v = (input.Base + input.Proc + input.Add + (toNumericFormulaValue(results["Shrink"]))) * (toNumericFormulaValue(results["FCR"])); results["CostPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerKg"] = Number.NaN; }
  try { const v = 0.0; results["Opt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Opt"] = Number.NaN; }
  return results;
}


export function calculateIlerleme_yem_maliyet(input: Ilerleme_yem_maliyetInput): Ilerleme_yem_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Opt"]);
  const breakdown = {
    Cost_Ing: toNumericFormulaValue(values["Cost_Ing"]),
    Cost_Base: toNumericFormulaValue(values["Cost_Base"]),
    Cost_Proc: toNumericFormulaValue(values["Cost_Proc"]),
    Cost_Add: toNumericFormulaValue(values["Cost_Add"]),
    Shrink: toNumericFormulaValue(values["Shrink"]),
    FCR: toNumericFormulaValue(values["FCR"]),
    CostPerKg: toNumericFormulaValue(values["CostPerKg"]),
    Opt: toNumericFormulaValue(values["Opt"])
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


export interface Ilerleme_yem_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Ing: number; Cost_Base: number; Cost_Proc: number; Cost_Add: number; Shrink: number; FCR: number; CostPerKg: number; Opt: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ilerleme_yem_maliyetOutputMeta = {
  primaryKey: "Opt",
  unit: "USD",
  breakdownKeys: ["Cost_Ing","Cost_Base","Cost_Proc","Cost_Add","Shrink","FCR","CostPerKg","Opt"],
} as const;

