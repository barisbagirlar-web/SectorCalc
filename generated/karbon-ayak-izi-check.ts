// Auto-generated from karbon-ayak-izi-check-schema.json
import * as z from 'zod';

export interface Karbon_ayak_izi_checkInput {
  FuelConsumption_i: number;
  EmissionFactor_i: number;
  FugitiveEmissions: number;
  ElectricityConsumption: number;
  GridEmissionFactor: number;
  GridFactor: number;
  REC_Factor: number;
  Material_i: number;
  MaterialEF_i: number;
  Logistics_Emissions: number;
  ProductionVolume: number;
  ForecastedCarbonPrice: number;
  dataConfidence?: number;
}

export const Karbon_ayak_izi_checkInputSchema = z.object({
  FuelConsumption_i: z.number().min(0).default(0),
  EmissionFactor_i: z.number().min(0).default(0),
  FugitiveEmissions: z.number().min(0).default(0),
  ElectricityConsumption: z.number().min(0).default(0),
  GridEmissionFactor: z.number().min(0).default(0),
  GridFactor: z.number().min(0).default(0),
  REC_Factor: z.number().min(0).default(0),
  Material_i: z.number().min(0).default(0),
  MaterialEF_i: z.number().min(0).default(0),
  Logistics_Emissions: z.number().min(0).default(0),
  ProductionVolume: z.number().min(0).default(0),
  ForecastedCarbonPrice: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Karbon_ayak_izi_checkInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["Scope1"] = Number.NaN;
  try { const v = input.ElectricityConsumption * input.GridEmissionFactor; results["Scope2_Location"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Scope2_Location"] = Number.NaN; }
  try { const v = input.ElectricityConsumption * (input.GridFactor - input.REC_Factor); results["Scope2_Market"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Scope2_Market"] = Number.NaN; }
  results["Scope3_Upstream"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Scope1"])) + (toNumericFormulaValue(results["Scope2_Market"])) + (toNumericFormulaValue(results["Scope3_Upstream"])); results["TotalCarbon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCarbon"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalCarbon"])) / input.ProductionVolume; results["CarbonIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarbonIntensity"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalCarbon"])) * input.ForecastedCarbonPrice; results["FinancialRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancialRisk"] = Number.NaN; }
  return results;
}


export function calculateKarbon_ayak_izi_check(input: Karbon_ayak_izi_checkInput): Karbon_ayak_izi_checkOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["FinancialRisk"]);
  const breakdown = {
    Scope1: toNumericFormulaValue(values["Scope1"]),
    Scope2_Location: toNumericFormulaValue(values["Scope2_Location"]),
    Scope2_Market: toNumericFormulaValue(values["Scope2_Market"]),
    Scope3_Upstream: toNumericFormulaValue(values["Scope3_Upstream"]),
    TotalCarbon: toNumericFormulaValue(values["TotalCarbon"]),
    CarbonIntensity: toNumericFormulaValue(values["CarbonIntensity"]),
    FinancialRisk: toNumericFormulaValue(values["FinancialRisk"])
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


export interface Karbon_ayak_izi_checkOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Scope1: number; Scope2_Location: number; Scope2_Market: number; Scope3_Upstream: number; TotalCarbon: number; CarbonIntensity: number; FinancialRisk: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Karbon_ayak_izi_checkOutputMeta = {
  primaryKey: "FinancialRisk",
  unit: "USD",
  breakdownKeys: ["Scope1","Scope2_Location","Scope2_Market","Scope3_Upstream","TotalCarbon","CarbonIntensity","FinancialRisk"],
} as const;

