// Auto-generated from carbohydrate-calculator-schema.json
import * as z from 'zod';

export interface Carbohydrate_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  carbPercentage: number;
  dataConfidence?: number;
}

export const Carbohydrate_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  carbPercentage: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Carbohydrate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender * (10*input.weight + 6.25*input.height - 5*input.age + 5) + (1 - input.gender) * (10*input.weight + 6.25*input.height - 5*input.age - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityLevel; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tdee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["tdee"])) * input.carbPercentage / 100; results["carbCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbCalories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["carbCalories"])) / 4; results["dailyCarbs"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCarbs"] = Number.NaN; }
  return results;
}


export function calculateCarbohydrate_calculator(input: Carbohydrate_calculatorInput): Carbohydrate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCarbs"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Carbohydrate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
