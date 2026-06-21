// Auto-generated from kaynak-hacmi-ve-maliyeti-schema.json
import * as z from 'zod';

export interface Kaynak_hacmi_ve_maliyetiInput {
  Leg: number;
  Length: number;
  Density: number;
  DepositionEfficiency: number;
  PricePerKg: number;
  GasFlowRate: number;
  ArcTime: number;
  GasPrice: number;
  Voltage: number;
  Current: number;
  MachineEff: number;
  ElecRate: number;
  DepositionRate: number;
  LaborRate: number;
  dataConfidence?: number;
}

export const Kaynak_hacmi_ve_maliyetiInputSchema = z.object({
  Leg: z.number().min(0).default(0),
  Length: z.number().min(0).default(0),
  Density: z.number().min(0).default(0),
  DepositionEfficiency: z.number().min(0).default(0),
  PricePerKg: z.number().min(0).default(0),
  GasFlowRate: z.number().min(0).default(0),
  ArcTime: z.number().min(0).default(0),
  GasPrice: z.number().min(0).default(0),
  Voltage: z.number().min(0).default(0),
  Current: z.number().min(0).default(0),
  MachineEff: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
  DepositionRate: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kaynak_hacmi_ve_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.Leg**2) / 2; results["Area_Weld"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Area_Weld"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Area_Weld"])) * input.Length; results["Volume_Weld"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Volume_Weld"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Volume_Weld"])) * input.Density; results["Weight_Deposited"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Weight_Deposited"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Weight_Deposited"])) / input.DepositionEfficiency; results["Weight_Electrode"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Weight_Electrode"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Weight_Electrode"])) * input.PricePerKg; results["Cost_Filler"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Filler"] = Number.NaN; }
  try { const v = input.GasFlowRate * input.ArcTime * input.GasPrice; results["Cost_Gas"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Gas"] = Number.NaN; }
  try { const v = (input.Voltage * input.Current * input.ArcTime) / (1000 * input.MachineEff) * input.ElecRate; results["Cost_Power"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Power"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Cost_Filler"])) + (toNumericFormulaValue(results["Cost_Gas"])) + (toNumericFormulaValue(results["Cost_Power"])) + (input.ArcTime / input.DepositionRate) * input.LaborRate; results["TotalWeldCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalWeldCost"] = Number.NaN; }
  return results;
}


export function calculateKaynak_hacmi_ve_maliyeti(input: Kaynak_hacmi_ve_maliyetiInput): Kaynak_hacmi_ve_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalWeldCost"]);
  const breakdown = {
    Area_Weld: toNumericFormulaValue(values["Area_Weld"]),
    Volume_Weld: toNumericFormulaValue(values["Volume_Weld"]),
    Weight_Deposited: toNumericFormulaValue(values["Weight_Deposited"]),
    Weight_Electrode: toNumericFormulaValue(values["Weight_Electrode"]),
    Cost_Filler: toNumericFormulaValue(values["Cost_Filler"]),
    Cost_Gas: toNumericFormulaValue(values["Cost_Gas"]),
    Cost_Power: toNumericFormulaValue(values["Cost_Power"]),
    TotalWeldCost: toNumericFormulaValue(values["TotalWeldCost"])
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


export interface Kaynak_hacmi_ve_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Area_Weld: number; Volume_Weld: number; Weight_Deposited: number; Weight_Electrode: number; Cost_Filler: number; Cost_Gas: number; Cost_Power: number; TotalWeldCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kaynak_hacmi_ve_maliyetiOutputMeta = {
  primaryKey: "TotalWeldCost",
  unit: "USD",
  breakdownKeys: ["Area_Weld","Volume_Weld","Weight_Deposited","Weight_Electrode","Cost_Filler","Cost_Gas","Cost_Power","TotalWeldCost"],
} as const;

