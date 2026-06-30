// Auto-generated from slope-stability-factor-calculator-schema.json
import * as z from 'zod';

export interface Slope_stability_factor_calculatorInput {
  dataConfidence?: number;
  kohezyon: number;
  normalGerilme: number;
  icSuratmeAcisi: number;
  kaymaGerilmesi: number;
}

export const Slope_stability_factor_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kohezyon: z.number().min(0).default(20),
  normalGerilme: z.number().min(0).default(100),
  icSuratmeAcisi: z.number().min(0).default(30),
  kaymaGerilmesi: z.number().min(0).default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Slope_stability_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["kohezyon"] + (input["normalGerilme"] * Math.tan(input["icSuratmeAcisi"] * Math.PI / 180)); results["dayanim"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dayanim"] = Number.NaN; }
  try { const v = (input["kohezyon"] + (input["normalGerilme"] * Math.tan(input["icSuratmeAcisi"] * Math.PI / 180))) / Math.max(0.0001, input["kaymaGerilmesi"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSlope_stability_factor_calculator(input: Slope_stability_factor_calculatorInput): Slope_stability_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "safety",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Slope_stability_factor_calculatorOutput {
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

export const Slope_stability_factor_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "safety",
  breakdownKeys: ["dayanim"],
} as const;
