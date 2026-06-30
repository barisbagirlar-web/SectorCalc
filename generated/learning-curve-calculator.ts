// Auto-generated from learning-curve-calculator-schema.json
import * as z from 'zod';

export interface Learning_curve_calculatorInput {
  dataConfidence?: number;
  ilkSure: number;
  ogrenmeOrani: number;
  uretilenAdet: number;
}

export const Learning_curve_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  ilkSure: z.number().min(0).default(100),
  ogrenmeOrani: z.number().min(1).max(100).default(90),
  uretilenAdet: z.number().min(1).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Learning_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(Math.max(0.0001, input["ogrenmeOrani"] / 100)) / Math.log(2); results["faktor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["faktor"] = Number.NaN; }
  try { const v = input["ilkSure"] * Math.pow(input["uretilenAdet"], (Math.log(Math.max(0.0001, input["ogrenmeOrani"] / 100)) / Math.log(2))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLearning_curve_calculator(input: Learning_curve_calculatorInput): Learning_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "min",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Learning_curve_calculatorOutput {
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

export const Learning_curve_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "min",
  breakdownKeys: ["faktor"],
} as const;
