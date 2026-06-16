// Auto-generated from calorie-calculator-schema.json
import * as z from 'zod';

export interface Calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityFactor: number;
}

export const Calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender == 1 ? 5 : -161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = input.activityFactor * (10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender == 1 ? 5 : -161)); results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  return results;
}


export function calculateCalorie_calculator(input: Calorie_calculatorInput): Calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tdee"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
