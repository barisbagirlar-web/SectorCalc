// Auto-generated from kompresor-kacagi-maliyet-schema.json
import * as z from 'zod';

export interface Kompresor_kacagi_maliyetInput {
  d: number;
  P_Line: number;
  T_Abs: number;
  Eff_Compressor: number;
  OperatingHours: number;
  ElectricityRate: number;
  Cost_Leak_i: number;
  GridEmissionFactor: number;
  RepairCost: number;
  dataConfidence?: number;
}

export const Kompresor_kacagi_maliyetInputSchema = z.object({
  d: z.number().min(0).default(0),
  P_Line: z.number().min(0).default(0),
  T_Abs: z.number().min(0).default(0),
  Eff_Compressor: z.number().min(0).default(0),
  OperatingHours: z.number().min(0).default(0),
  ElectricityRate: z.number().min(0).default(0),
  Cost_Leak_i: z.number().min(0).default(0),
  GridEmissionFactor: z.number().min(0).default(0),
  RepairCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kompresor_kacagi_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (22.4 * input.d**2 * input.P_Line) / Math.sqrt(input.T_Abs); results["LeakFlow_CFM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LeakFlow_CFM"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["LeakFlow_CFM"])) * input.P_Line * 144) / (33000 * input.Eff_Compressor); results["Power_Loss_kW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Power_Loss_kW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Power_Loss_kW"])) * input.OperatingHours; results["AnnualEnergyLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualEnergyLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AnnualEnergyLoss"])) * input.ElectricityRate; results["Cost_Leak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Leak"] = Number.NaN; }
  results["TotalLeakCost"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["AnnualEnergyLoss"])) * input.GridEmissionFactor; results["CarbonEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarbonEmissions"] = Number.NaN; }
  try { const v = input.RepairCost / (toNumericFormulaValue(results["Cost_Leak"])); results["Payback_Repair"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Payback_Repair"] = Number.NaN; }
  return results;
}


export function calculateKompresor_kacagi_maliyet(input: Kompresor_kacagi_maliyetInput): Kompresor_kacagi_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Payback_Repair"]);
  const breakdown = {
    LeakFlow_CFM: toNumericFormulaValue(values["LeakFlow_CFM"]),
    Power_Loss_kW: toNumericFormulaValue(values["Power_Loss_kW"]),
    AnnualEnergyLoss: toNumericFormulaValue(values["AnnualEnergyLoss"]),
    Cost_Leak: toNumericFormulaValue(values["Cost_Leak"]),
    TotalLeakCost: toNumericFormulaValue(values["TotalLeakCost"]),
    CarbonEmissions: toNumericFormulaValue(values["CarbonEmissions"]),
    Payback_Repair: toNumericFormulaValue(values["Payback_Repair"])
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


export interface Kompresor_kacagi_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { LeakFlow_CFM: number; Power_Loss_kW: number; AnnualEnergyLoss: number; Cost_Leak: number; TotalLeakCost: number; CarbonEmissions: number; Payback_Repair: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kompresor_kacagi_maliyetOutputMeta = {
  primaryKey: "Payback_Repair",
  unit: "USD",
  breakdownKeys: ["LeakFlow_CFM","Power_Loss_kW","AnnualEnergyLoss","Cost_Leak","TotalLeakCost","CarbonEmissions","Payback_Repair"],
} as const;

