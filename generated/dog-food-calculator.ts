// Auto-generated from dog-food-calculator-schema.json
import * as z from 'zod';

export interface Dog_food_calculatorInput {
  weight: number;
  activityFactor: number;
  ageMultiplier: number;
  foodEnergyDensity: number;
}

export const Dog_food_calculatorInputSchema = z.object({
  weight: z.number().default(20),
  activityFactor: z.number().default(1.6),
  ageMultiplier: z.number().default(1),
  foodEnergyDensity: z.number().default(350),
});

function evaluateAllFormulas(input: Dog_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 70 * Math.pow(input.weight, 0.75); results["rer"] = Number.isFinite(v) ? v : 0; } catch { results["rer"] = 0; }
  try { const v = (results["rer"] ?? 0) * input.activityFactor * input.ageMultiplier; results["der"] = Number.isFinite(v) ? v : 0; } catch { results["der"] = 0; }
  try { const v = (results["der"] ?? 0) * 100 / input.foodEnergyDensity; results["dailyFoodGrams"] = Number.isFinite(v) ? v : 0; } catch { results["dailyFoodGrams"] = 0; }
  return results;
}


export function calculateDog_food_calculator(input: Dog_food_calculatorInput): Dog_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyFoodGrams"] ?? 0;
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


export interface Dog_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
