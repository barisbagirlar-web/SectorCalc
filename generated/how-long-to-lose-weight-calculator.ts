// Auto-generated from how-long-to-lose-weight-calculator-schema.json
import * as z from 'zod';

export interface How_long_to_lose_weight_calculatorInput {
  currentWeight_kg: number;
  goalWeight_kg: number;
  height_cm: number;
  age: number;
  gender: number;
  activityLevel: number;
  dailyCalorieIntake: number;
  dataConfidence?: number;
}

export const How_long_to_lose_weight_calculatorInputSchema = z.object({
  currentWeight_kg: z.number().default(80),
  goalWeight_kg: z.number().default(70),
  height_cm: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.2),
  dailyCalorieIntake: z.number().default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: How_long_to_lose_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight_kg - input.goalWeight_kg; results["weightDiff_kg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightDiff_kg"] = Number.NaN; }
  try { const v = input.gender === 1 ? (10 * input.currentWeight_kg + 6.25 * input.height_cm - 5 * input.age + 5) : (10 * input.currentWeight_kg + 6.25 * input.height_cm - 5 * input.age - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityLevel; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tdee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["tdee"])) - input.dailyCalorieIntake; results["calorieDeficit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["calorieDeficit"] = Number.NaN; }
  return results;
}


export function calculateHow_long_to_lose_weight_calculator(input: How_long_to_lose_weight_calculatorInput): How_long_to_lose_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calorieDeficit"]);
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


export interface How_long_to_lose_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
