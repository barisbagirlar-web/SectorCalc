// Auto-generated from 2d-inverse-kinematics-calculator-schema.json
import * as z from 'zod';

export interface _2d_inverse_kinematics_calculatorInput {
  dataConfidence?: number;
  hedefX: number;
  hedefY: number;
  kol1Uzunluk: number;
  kol2Uzunluk: number;
}

export const _2d_inverse_kinematics_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  hedefX: z.number().min(0).default(0.5),
  hedefY: z.number().min(0).default(0.5),
  kol1Uzunluk: z.number().min(0).default(0.4),
  kol2Uzunluk: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _2d_inverse_kinematics_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.acos(Math.max(-1, Math.min(1, (input["hedefX"]*input["hedefX"] + input["hedefY"]*input["hedefY"] - input["kol1Uzunluk"]*input["kol1Uzunluk"] - input["kol2Uzunluk"]*input["kol2Uzunluk"]) / Math.max(0.0001, (2 * input["kol1Uzunluk"] * input["kol2Uzunluk"]))))); results["aci2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aci2"] = Number.NaN; }
  try { const v = Math.atan2(input["hedefY"], input["hedefX"]) - Math.atan2(input["kol2Uzunluk"]*Math.sin(results["aci2"]), input["kol1Uzunluk"] + input["kol2Uzunluk"]*Math.cos(results["aci2"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculate_2d_inverse_kinematics_calculator(input: _2d_inverse_kinematics_calculatorInput): _2d_inverse_kinematics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "aci2": toNumericFormulaValue(values["aci2"])
  };
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "rad",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface _2d_inverse_kinematics_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const _2d_inverse_kinematics_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "rad",
  breakdownKeys: ["aci2"],
} as const;
