// Auto-generated from cnc-isleme-maliyeti-schema.json
import * as z from 'zod';

export interface Cnc_isleme_maliyetiInput {
  Volume_raw: number;
  Density: number;
  PricePerKg: number;
  ScrapRate: number;
  T_total: number;
  MachineRate: number;
  T_cut: number;
  ToolLife: number;
  ToolCost: number;
  ElecRate: number;
  OverheadRate: number;
  Material: number;
  Machining: number;
  Tooling: number;
  Energy: number;
  Overhead: number;
  Quality: number;
  dataConfidence?: number;
}

export const Cnc_isleme_maliyetiInputSchema = z.object({
  Volume_raw: z.number().min(0).default(0),
  Density: z.number().min(0).default(0),
  PricePerKg: z.number().min(0).default(0),
  ScrapRate: z.number().min(0).default(0),
  T_total: z.number().min(0).default(0),
  MachineRate: z.number().min(0).default(0),
  T_cut: z.number().min(0).default(0),
  ToolLife: z.number().min(0).default(0),
  ToolCost: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
  OverheadRate: z.number().min(0).default(0),
  Material: z.number().min(0).default(0),
  Machining: z.number().min(0).default(0),
  Tooling: z.number().min(0).default(0),
  Energy: z.number().min(0).default(0),
  Overhead: z.number().min(0).default(0),
  Quality: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cnc_isleme_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Volume_raw * input.Density * input.PricePerKg * (1 + input.ScrapRate); results["Cost_Material"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Material"] = Number.NaN; }
  try { const v = input.T_total * input.MachineRate; results["Cost_Machining"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Machining"] = Number.NaN; }
  try { const v = (input.T_cut / input.ToolLife) * input.ToolCost; results["Cost_Tooling"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Tooling"] = Number.NaN; }
  results["Cost_Energy"] = Number.NaN;
  try { const v = input.T_total * input.OverheadRate; results["Cost_Overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Overhead"] = Number.NaN; }
  try { const v = input.Material + input.Machining + input.Tooling + input.Energy + input.Overhead + input.Quality; results["TotalUnitCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalUnitCost"] = Number.NaN; }
  return results;
}


export function calculateCnc_isleme_maliyeti(input: Cnc_isleme_maliyetiInput): Cnc_isleme_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalUnitCost"]);
  const breakdown = {
    Cost_Material: toNumericFormulaValue(values["Cost_Material"]),
    Cost_Machining: toNumericFormulaValue(values["Cost_Machining"]),
    Cost_Tooling: toNumericFormulaValue(values["Cost_Tooling"]),
    Cost_Energy: toNumericFormulaValue(values["Cost_Energy"]),
    Cost_Overhead: toNumericFormulaValue(values["Cost_Overhead"]),
    TotalUnitCost: toNumericFormulaValue(values["TotalUnitCost"])
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


export interface Cnc_isleme_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Material: number; Cost_Machining: number; Cost_Tooling: number; Cost_Energy: number; Cost_Overhead: number; TotalUnitCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cnc_isleme_maliyetiOutputMeta = {
  primaryKey: "TotalUnitCost",
  unit: "USD",
  breakdownKeys: ["Cost_Material","Cost_Machining","Cost_Tooling","Cost_Energy","Cost_Overhead","TotalUnitCost"],
} as const;

