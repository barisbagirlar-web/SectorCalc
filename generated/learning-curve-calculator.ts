// Auto-generated from learning-curve-calculator-schema.json
import * as z from 'zod';

export interface Learning_curve_calculatorInput {
  ilkSure: number;
  ogrenmeOrani: number;
  uretilenAdet: number;
  dataConfidence?: number;
}

export const Learning_curve_calculatorInputSchema = z.object({
  ilkSure: z.number().min(0).default(100),
  ogrenmeOrani: z.number().min(1).max(100).default(90),
  uretilenAdet: z.number().min(1).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Learning_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(Math.max(0.0001, input.ogrenmeOrani / 100)) / Math.log(2); results["faktor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["faktor"] = Number.NaN; }
  try { const v = input.ilkSure * Math.pow(input.uretilenAdet, (Math.log(Math.max(0.0001, input.ogrenmeOrani / 100)) / Math.log(2))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLearning_curve_calculator(input: Learning_curve_calculatorInput): Learning_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "min",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Learning_curve_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Learning_curve_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "min",
  breakdownKeys: ["sonuc"],
} as const;

