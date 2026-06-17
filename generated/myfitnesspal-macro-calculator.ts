// @ts-nocheck
// Auto-generated from myfitnesspal-macro-calculator-schema.json
import * as z from 'zod';

export interface Myfitnesspal_macro_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  goalFactor: number;
}

export const Myfitnesspal_macro_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.55),
  goalFactor: z.number().default(0.8),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Myfitnesspal_macro_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.gender === 0 ? (10 * input.weight + 6.25 * input.height - 5 * input.age - 161) : (10 * input.weight + 6.25 * input.height - 5 * input.age + 5); results["BMR"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = (asFormulaNumber(results["BMR"])) * input.activityLevel; results["TDEE"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["TDEE"] = 0; }
  try { const v = (asFormulaNumber(results["TDEE"])) * input.goalFactor; results["dailyCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = ((asFormulaNumber(results["dailyCalories"])) * 0.30) / 4; results["protein"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["protein"] = 0; }
  try { const v = ((asFormulaNumber(results["dailyCalories"])) * 0.45) / 4; results["carbs"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbs"] = 0; }
  try { const v = ((asFormulaNumber(results["dailyCalories"])) * 0.25) / 9; results["fat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fat"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMyfitnesspal_macro_calculator(input: Myfitnesspal_macro_calculatorInput): Myfitnesspal_macro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCalories"]);
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


export interface Myfitnesspal_macro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
