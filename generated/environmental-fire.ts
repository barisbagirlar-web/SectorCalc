// Auto-generated from environmental-fire-schema.json
import * as z from 'zod';

export interface Environmental_fireInput {
  Waste: number;
  DispFee: number;
  HazMass: number;
  HazFee: number;
  Surcharge: number;
  RecycMass: number;
  SortCost: number;
  ScrapRev: number;
  Air: number;
  CarbonPrice: number;
  Water: number;
  TreatCost: number;
  ProbViolation: number;
  Fine: number;
  Disp: number;
  Haz: number;
  Recyc: number;
  Emis: number;
  Penalty: number;
  TotalWaste: number;
  Volume: number;
  dataConfidence?: number;
}

export const Environmental_fireInputSchema = z.object({
  Waste: z.number().min(0).default(0),
  DispFee: z.number().min(0).default(0),
  HazMass: z.number().min(0).default(0),
  HazFee: z.number().min(0).default(0),
  Surcharge: z.number().min(0).default(0),
  RecycMass: z.number().min(0).default(0),
  SortCost: z.number().min(0).default(0),
  ScrapRev: z.number().min(0).default(0),
  Air: z.number().min(0).default(0),
  CarbonPrice: z.number().min(0).default(0),
  Water: z.number().min(0).default(0),
  TreatCost: z.number().min(0).default(0),
  ProbViolation: z.number().min(0).default(0),
  Fine: z.number().min(0).default(0),
  Disp: z.number().min(0).default(0),
  Haz: z.number().min(0).default(0),
  Recyc: z.number().min(0).default(0),
  Emis: z.number().min(0).default(0),
  Penalty: z.number().min(0).default(0),
  TotalWaste: z.number().min(0).default(0),
  Volume: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Environmental_fireInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Waste * input.DispFee; results["Cost_Disp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Disp"] = Number.NaN; }
  try { const v = input.HazMass * (input.HazFee + input.Surcharge); results["Cost_Haz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Haz"] = Number.NaN; }
  try { const v = input.RecycMass * (input.SortCost - input.ScrapRev); results["Cost_Recyc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Recyc"] = Number.NaN; }
  try { const v = input.Air * input.CarbonPrice + input.Water * input.TreatCost; results["Cost_Emis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Emis"] = Number.NaN; }
  try { const v = input.ProbViolation * input.Fine; results["PenaltyRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PenaltyRisk"] = Number.NaN; }
  try { const v = input.Disp + input.Haz + input.Recyc + input.Emis + input.Penalty; results["Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total"] = Number.NaN; }
  try { const v = input.TotalWaste / input.Volume; results["WasteIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WasteIntensity"] = Number.NaN; }
  try { const v = input.Recyc / input.TotalWaste; results["Circularity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Circularity"] = Number.NaN; }
  return results;
}


export function calculateEnvironmental_fire(input: Environmental_fireInput): Environmental_fireOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Circularity"]);
  const breakdown = {
    Cost_Disp: toNumericFormulaValue(values["Cost_Disp"]),
    Cost_Haz: toNumericFormulaValue(values["Cost_Haz"]),
    Cost_Recyc: toNumericFormulaValue(values["Cost_Recyc"]),
    Cost_Emis: toNumericFormulaValue(values["Cost_Emis"]),
    PenaltyRisk: toNumericFormulaValue(values["PenaltyRisk"]),
    Total: toNumericFormulaValue(values["Total"]),
    WasteIntensity: toNumericFormulaValue(values["WasteIntensity"]),
    Circularity: toNumericFormulaValue(values["Circularity"])
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


export interface Environmental_fireOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Disp: number; Cost_Haz: number; Cost_Recyc: number; Cost_Emis: number; PenaltyRisk: number; Total: number; WasteIntensity: number; Circularity: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Environmental_fireOutputMeta = {
  primaryKey: "Circularity",
  unit: "USD",
  breakdownKeys: ["Cost_Disp","Cost_Haz","Cost_Recyc","Cost_Emis","PenaltyRisk","Total","WasteIntensity","Circularity"],
} as const;

