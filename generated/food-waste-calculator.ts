// Auto-generated from food-waste-calculator-schema.json
import * as z from 'zod';

export interface Food_waste_calculatorInput {
  totalFoodProduced: number;
  totalFoodWasted: number;
  costPerKg: number;
  mealsServed: number;
}

export const Food_waste_calculatorInputSchema = z.object({
  totalFoodProduced: z.number().default(0),
  totalFoodWasted: z.number().default(0),
  costPerKg: z.number().default(0),
  mealsServed: z.number().default(0),
});

function evaluateAllFormulas(input: Food_waste_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalFoodWasted * input.costPerKg; results["totalWasteCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalWasteCost"] = 0; }
  try { const v = input.totalFoodProduced !== 0 ? (input.totalFoodWasted / input.totalFoodProduced) * 100 : 0; results["wastePercentage"] = Number.isFinite(v) ? v : 0; } catch { results["wastePercentage"] = 0; }
  try { const v = input.mealsServed !== 0 ? input.totalFoodWasted / input.mealsServed : 0; results["wastePerMealKg"] = Number.isFinite(v) ? v : 0; } catch { results["wastePerMealKg"] = 0; }
  try { const v = input.mealsServed !== 0 ? (input.totalFoodWasted * input.costPerKg) / input.mealsServed : 0; results["wasteCostPerMeal"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCostPerMeal"] = 0; }
  return results;
}


export function calculateFood_waste_calculator(input: Food_waste_calculatorInput): Food_waste_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWasteCost"] ?? 0;
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


export interface Food_waste_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
