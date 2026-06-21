// Auto-generated from hurda-orani-optimize-schema.json
import * as z from 'zod';

export interface Hurda_orani_optimizeInput {
  ScrapQty: number;
  TotalInput: number;
  MatCost: number;
  Cycle: number;
  LabRate: number;
  MachRate: number;
  UnitMargin: number;
  Mat: number;
  Lab: number;
  OH: number;
  Opp: number;
  Salvage: number;
  Defects: number;
  Freq: number;
  Benchmark: number;
  ImpFactor: number;
  dataConfidence?: number;
}

export const Hurda_orani_optimizeInputSchema = z.object({
  ScrapQty: z.number().min(0).default(0),
  TotalInput: z.number().min(0).default(0),
  MatCost: z.number().min(0).default(0),
  Cycle: z.number().min(0).default(0),
  LabRate: z.number().min(0).default(0),
  MachRate: z.number().min(0).default(0),
  UnitMargin: z.number().min(0).default(0),
  Mat: z.number().min(0).default(0),
  Lab: z.number().min(0).default(0),
  OH: z.number().min(0).default(0),
  Opp: z.number().min(0).default(0),
  Salvage: z.number().min(0).default(0),
  Defects: z.number().min(0).default(0),
  Freq: z.number().min(0).default(0),
  Benchmark: z.number().min(0).default(0),
  ImpFactor: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hurda_orani_optimizeInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ScrapQty / input.TotalInput; results["ScrapRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ScrapRate"] = Number.NaN; }
  try { const v = input.ScrapQty * input.MatCost; results["Cost_Mat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Mat"] = Number.NaN; }
  try { const v = input.ScrapQty * input.Cycle * input.LabRate; results["Cost_Lab"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Lab"] = Number.NaN; }
  try { const v = input.ScrapQty * input.Cycle * input.MachRate; results["Cost_OH"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_OH"] = Number.NaN; }
  try { const v = input.ScrapQty * input.UnitMargin; results["OppCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OppCost"] = Number.NaN; }
  try { const v = input.Mat + input.Lab + input.OH + input.Opp - input.Salvage; results["TotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCost"] = Number.NaN; }
  results["Pareto"] = Number.NaN;
  try { const v = input.Benchmark * (1 - input.ImpFactor); results["Target"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Target"] = Number.NaN; }
  return results;
}


export function calculateHurda_orani_optimize(input: Hurda_orani_optimizeInput): Hurda_orani_optimizeOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Target"]);
  const breakdown = {
    ScrapRate: toNumericFormulaValue(values["ScrapRate"]),
    Cost_Mat: toNumericFormulaValue(values["Cost_Mat"]),
    Cost_Lab: toNumericFormulaValue(values["Cost_Lab"]),
    Cost_OH: toNumericFormulaValue(values["Cost_OH"]),
    OppCost: toNumericFormulaValue(values["OppCost"]),
    TotalCost: toNumericFormulaValue(values["TotalCost"]),
    Pareto: toNumericFormulaValue(values["Pareto"]),
    Target: toNumericFormulaValue(values["Target"])
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


export interface Hurda_orani_optimizeOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ScrapRate: number; Cost_Mat: number; Cost_Lab: number; Cost_OH: number; OppCost: number; TotalCost: number; Pareto: number; Target: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hurda_orani_optimizeOutputMeta = {
  primaryKey: "Target",
  unit: "USD",
  breakdownKeys: ["ScrapRate","Cost_Mat","Cost_Lab","Cost_OH","OppCost","TotalCost","Pareto","Target"],
} as const;

