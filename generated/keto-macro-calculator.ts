// @ts-nocheck
// Auto-generated from keto-macro-calculator-schema.json
import * as z from 'zod';

export interface Keto_macro_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityFactor: number;
  calorieAdjustment: number;
}

export const Keto_macro_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityFactor: z.number().default(1.55),
  calorieAdjustment: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Keto_macro_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 10*input.weight + 6.25*input.height - 5*input.age + (input.gender === 0 ? -161 : 5); results["bmr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (asFormulaNumber(results["bmr"])) * input.activityFactor; results["tdee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (asFormulaNumber(results["tdee"])) + input.calorieAdjustment; results["adjustedCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedCalories"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedCalories"])) * 0.7 / 9; results["fat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fat"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedCalories"])) * 0.25 / 4; results["protein"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["protein"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedCalories"])) * 0.05 / 4; results["carbs"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbs"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKeto_macro_calculator(input: Keto_macro_calculatorInput): Keto_macro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedCalories"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Keto_macro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
