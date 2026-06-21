// Auto-generated from dye-recete-maliyet-schema.json
import * as z from 'zod';

export interface Dye_recete_maliyetInput {
  Conc: number;
  Price: number;
  BathRatio: number;
  Dosage: number;
  LiquorRatio: number;
  Weight: number;
  WaterTariff: number;
  Heating: number;
  Holding: number;
  Drying: number;
  Effluent: number;
  TreatCost: number;
  Surcharge: number;
  Dye: number;
  Chem: number;
  Water: number;
  Energy: number;
  Waste: number;
  Rework: number;
  RFT: number;
  dataConfidence?: number;
}

export const Dye_recete_maliyetInputSchema = z.object({
  Conc: z.number().min(0).default(0),
  Price: z.number().min(0).default(0),
  BathRatio: z.number().min(0).default(0),
  Dosage: z.number().min(0).default(0),
  LiquorRatio: z.number().min(0).default(0),
  Weight: z.number().min(0).default(0),
  WaterTariff: z.number().min(0).default(0),
  Heating: z.number().min(0).default(0),
  Holding: z.number().min(0).default(0),
  Drying: z.number().min(0).default(0),
  Effluent: z.number().min(0).default(0),
  TreatCost: z.number().min(0).default(0),
  Surcharge: z.number().min(0).default(0),
  Dye: z.number().min(0).default(0),
  Chem: z.number().min(0).default(0),
  Water: z.number().min(0).default(0),
  Energy: z.number().min(0).default(0),
  Waste: z.number().min(0).default(0),
  Rework: z.number().min(0).default(0),
  RFT: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dye_recete_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["Cost_Dye"] = Number.NaN;
  results["Cost_Chem"] = Number.NaN;
  try { const v = input.LiquorRatio * input.Weight * input.WaterTariff; results["Cost_Water"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Water"] = Number.NaN; }
  try { const v = input.Heating + input.Holding + input.Drying; results["Cost_Energy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Energy"] = Number.NaN; }
  try { const v = input.Effluent * input.TreatCost + input.Surcharge; results["Cost_Waste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Waste"] = Number.NaN; }
  try { const v = input.Dye + input.Chem + input.Water + input.Energy + input.Waste; results["TotalBatch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalBatch"] = Number.NaN; }
  try { const v = input.Rework * (1 - input.RFT); results["RFT_Savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RFT_Savings"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["TotalBatch"])) + (toNumericFormulaValue(results["RFT_Savings"]))) / input.Weight; results["CostPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerKg"] = Number.NaN; }
  return results;
}


export function calculateDye_recete_maliyet(input: Dye_recete_maliyetInput): Dye_recete_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostPerKg"]);
  const breakdown = {
    Cost_Dye: toNumericFormulaValue(values["Cost_Dye"]),
    Cost_Chem: toNumericFormulaValue(values["Cost_Chem"]),
    Cost_Water: toNumericFormulaValue(values["Cost_Water"]),
    Cost_Energy: toNumericFormulaValue(values["Cost_Energy"]),
    Cost_Waste: toNumericFormulaValue(values["Cost_Waste"]),
    TotalBatch: toNumericFormulaValue(values["TotalBatch"]),
    RFT_Savings: toNumericFormulaValue(values["RFT_Savings"]),
    CostPerKg: toNumericFormulaValue(values["CostPerKg"])
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


export interface Dye_recete_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Dye: number; Cost_Chem: number; Cost_Water: number; Cost_Energy: number; Cost_Waste: number; TotalBatch: number; RFT_Savings: number; CostPerKg: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dye_recete_maliyetOutputMeta = {
  primaryKey: "CostPerKg",
  unit: "USD",
  breakdownKeys: ["Cost_Dye","Cost_Chem","Cost_Water","Cost_Energy","Cost_Waste","TotalBatch","RFT_Savings","CostPerKg"],
} as const;

