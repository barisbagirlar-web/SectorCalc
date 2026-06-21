// Auto-generated from daily-macronutrient-targets-calculator-schema.json
import * as z from 'zod';

export interface Daily_macronutrient_targets_calculatorInput {
  tdee: number;
  protein: number;
  yag: number;
  karb: number;
  dataConfidence?: number;
}

export const Daily_macronutrient_targets_calculatorInputSchema = z.object({
  tdee: z.number().min(0).default(2500),
  protein: z.number().min(5).max(50).default(30),
  yag: z.number().min(5).max(50).default(25),
  karb: z.number().min(5).max(80).default(45),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Daily_macronutrient_targets_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tdee * input.protein / 100) / 4; results["protein_g"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["protein_g"] = Number.NaN; }
  try { const v = (input.tdee * input.yag / 100) / 9; results["yag_g"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yag_g"] = Number.NaN; }
  try { const v = (input.tdee * input.karb / 100) / 4; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDaily_macronutrient_targets_calculator(input: Daily_macronutrient_targets_calculatorInput): Daily_macronutrient_targets_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    protein_g: toNumericFormulaValue(values["protein_g"]),
    yag_g: toNumericFormulaValue(values["yag_g"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
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
    unit: "g",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Daily_macronutrient_targets_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { protein_g: number; yag_g: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Daily_macronutrient_targets_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "g",
  breakdownKeys: ["protein_g","yag_g","sonuc"],
} as const;

