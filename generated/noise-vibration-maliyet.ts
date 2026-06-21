// Auto-generated from noise-vibration-maliyet-schema.json
import * as z from 'zod';

export interface Noise_vibration_maliyetInput {
  T: number;
  t_i: number;
  L_i: number;
  a_i: number;
  Noise: number;
  Vibration: number;
  Limit: number;
  MedicalScreening: number;
  PPE_Cost: number;
  InsurancePremiumHike: number;
  ActualOutput: number;
  BaselineOutput: number;
  UnitMargin: number;
  VibrationDefectRate: number;
  TotalUnits: number;
  ReworkCostPerUnit: number;
  ProdLoss: number;
  MitigationInvestment: number;
  dataConfidence?: number;
}

export const Noise_vibration_maliyetInputSchema = z.object({
  T: z.number().min(0).default(0),
  t_i: z.number().min(0).default(0),
  L_i: z.number().min(0).default(0),
  a_i: z.number().min(0).default(0),
  Noise: z.number().min(0).default(0),
  Vibration: z.number().min(0).default(0),
  Limit: z.number().min(0).default(0),
  MedicalScreening: z.number().min(0).default(0),
  PPE_Cost: z.number().min(0).default(0),
  InsurancePremiumHike: z.number().min(0).default(0),
  ActualOutput: z.number().min(0).default(0),
  BaselineOutput: z.number().min(0).default(0),
  UnitMargin: z.number().min(0).default(0),
  VibrationDefectRate: z.number().min(0).default(0),
  TotalUnits: z.number().min(0).default(0),
  ReworkCostPerUnit: z.number().min(0).default(0),
  ProdLoss: z.number().min(0).default(0),
  MitigationInvestment: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Noise_vibration_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["NoiseExposure_dBA"] = Number.NaN;
  results["Vibration_RMS"] = Number.NaN;
  results["HealthCost"] = Number.NaN;
  try { const v = (input.ActualOutput - input.BaselineOutput) * input.UnitMargin; results["ProductivityLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProductivityLoss"] = Number.NaN; }
  try { const v = input.VibrationDefectRate * input.TotalUnits * input.ReworkCostPerUnit; results["ReworkCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ReworkCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["HealthCost"])) + input.ProdLoss + (toNumericFormulaValue(results["ReworkCost"]))) / input.MitigationInvestment; results["MitigationROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MitigationROI"] = Number.NaN; }
  return results;
}


export function calculateNoise_vibration_maliyet(input: Noise_vibration_maliyetInput): Noise_vibration_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MitigationROI"]);
  const breakdown = {
    NoiseExposure_dBA: toNumericFormulaValue(values["NoiseExposure_dBA"]),
    Vibration_RMS: toNumericFormulaValue(values["Vibration_RMS"]),
    HealthCost: toNumericFormulaValue(values["HealthCost"]),
    ProductivityLoss: toNumericFormulaValue(values["ProductivityLoss"]),
    ReworkCost: toNumericFormulaValue(values["ReworkCost"]),
    MitigationROI: toNumericFormulaValue(values["MitigationROI"])
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


export interface Noise_vibration_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { NoiseExposure_dBA: number; Vibration_RMS: number; HealthCost: number; ProductivityLoss: number; ReworkCost: number; MitigationROI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Noise_vibration_maliyetOutputMeta = {
  primaryKey: "MitigationROI",
  unit: "USD",
  breakdownKeys: ["NoiseExposure_dBA","Vibration_RMS","HealthCost","ProductivityLoss","ReworkCost","MitigationROI"],
} as const;

