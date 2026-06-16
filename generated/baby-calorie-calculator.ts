// Auto-generated from baby-calorie-calculator-schema.json
import * as z from 'zod';

export interface Baby_calorie_calculatorInput {
  weight: number;
  age: number;
  feedingMultiplier: number;
  solidCalories: number;
}

export const Baby_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(4.5),
  age: z.number().default(2),
  feedingMultiplier: z.number().default(1),
  solidCalories: z.number().default(0),
});

function evaluateAllFormulas(input: Baby_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (120 - 10 * Math.log(input.age + 1)); results["base"] = Number.isFinite(v) ? v : 0; } catch { results["base"] = 0; }
  try { const v = (results["base"] ?? 0) * input.feedingMultiplier; results["adjusted"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted"] = 0; }
  try { const v = (results["adjusted"] ?? 0) + input.solidCalories; results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateBaby_calorie_calculator(input: Baby_calorie_calculatorInput): Baby_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["${total} kcal"] ?? 0;
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


export interface Baby_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
