// Auto-generated from gida-fire-marj-schema.json
import * as z from 'zod';

export interface Gida_fire_marjInput {
  Finished: number;
  Raw: number;
  RawCost: number;
  Spoiled: number;
  ProdCost: number;
  Excess: number;
  UnitCost: number;
  Salvage: number;
  Shrink: number;
  Spoil: number;
  Over: number;
  Avail: number;
  Perf: number;
  Qual_Yield: number;
  Recipe: number;
  ActualProd: number;
  Actual: number;
  Theo: number;
  dataConfidence?: number;
}

export const Gida_fire_marjInputSchema = z.object({
  Finished: z.number().min(0).default(0),
  Raw: z.number().min(0).default(0),
  RawCost: z.number().min(0).default(0),
  Spoiled: z.number().min(0).default(0),
  ProdCost: z.number().min(0).default(0),
  Excess: z.number().min(0).default(0),
  UnitCost: z.number().min(0).default(0),
  Salvage: z.number().min(0).default(0),
  Shrink: z.number().min(0).default(0),
  Spoil: z.number().min(0).default(0),
  Over: z.number().min(0).default(0),
  Avail: z.number().min(0).default(0),
  Perf: z.number().min(0).default(0),
  Qual_Yield: z.number().min(0).default(0),
  Recipe: z.number().min(0).default(0),
  ActualProd: z.number().min(0).default(0),
  Actual: z.number().min(0).default(0),
  Theo: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gida_fire_marjInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Finished / input.Raw; results["Yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Yield"] = Number.NaN; }
  try { const v = input.Raw - input.Finished; results["Shrinkage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Shrinkage"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Shrinkage"])) * input.RawCost; results["Cost_Shrink"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Shrink"] = Number.NaN; }
  try { const v = input.Spoiled * input.ProdCost; results["Cost_Spoil"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Spoil"] = Number.NaN; }
  try { const v = input.Excess * (input.UnitCost - input.Salvage); results["Cost_Over"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Over"] = Number.NaN; }
  try { const v = input.Shrink + input.Spoil + input.Over; results["MarginLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarginLeak"] = Number.NaN; }
  try { const v = input.Avail * input.Perf * input.Qual_Yield; results["OEE_Food"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OEE_Food"] = Number.NaN; }
  try { const v = input.Recipe * input.ActualProd; results["TheoUsage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TheoUsage"] = Number.NaN; }
  try { const v = input.Actual - input.Theo; results["Variance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Variance"] = Number.NaN; }
  return results;
}


export function calculateGida_fire_marj(input: Gida_fire_marjInput): Gida_fire_marjOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Variance"]);
  const breakdown = {
    Yield: toNumericFormulaValue(values["Yield"]),
    Shrinkage: toNumericFormulaValue(values["Shrinkage"]),
    Cost_Shrink: toNumericFormulaValue(values["Cost_Shrink"]),
    Cost_Spoil: toNumericFormulaValue(values["Cost_Spoil"]),
    Cost_Over: toNumericFormulaValue(values["Cost_Over"]),
    MarginLeak: toNumericFormulaValue(values["MarginLeak"]),
    OEE_Food: toNumericFormulaValue(values["OEE_Food"]),
    TheoUsage: toNumericFormulaValue(values["TheoUsage"]),
    Variance: toNumericFormulaValue(values["Variance"])
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


export interface Gida_fire_marjOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Yield: number; Shrinkage: number; Cost_Shrink: number; Cost_Spoil: number; Cost_Over: number; MarginLeak: number; OEE_Food: number; TheoUsage: number; Variance: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gida_fire_marjOutputMeta = {
  primaryKey: "Variance",
  unit: "USD",
  breakdownKeys: ["Yield","Shrinkage","Cost_Shrink","Cost_Spoil","Cost_Over","MarginLeak","OEE_Food","TheoUsage","Variance"],
} as const;

