// Auto-generated from calorie-counter-calculator-schema.json
import * as z from 'zod';

export interface Calorie_counter_calculatorInput {
  gender: number;
  age: number;
  weight_kg: number;
  height_cm: number;
  activity_level: number;
  dataConfidence?: number;
}

export const Calorie_counter_calculatorInputSchema = z.object({
  gender: z.number().default(0),
  age: z.number().default(30),
  weight_kg: z.number().default(70),
  height_cm: z.number().default(170),
  activity_level: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Calorie_counter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gender * (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age + 5)) + ((1 - input.gender) * (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age - 161)); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activity_level; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tdee"] = Number.NaN; }
  return results;
}


export function calculateCalorie_counter_calculator(input: Calorie_counter_calculatorInput): Calorie_counter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tdee"]);
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


export interface Calorie_counter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
