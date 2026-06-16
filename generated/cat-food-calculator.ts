// Auto-generated from cat-food-calculator-schema.json
import * as z from 'zod';

export interface Cat_food_calculatorInput {
  catWeight: number;
  dailyFoodPerKg: number;
  foodPackageWeight: number;
  foodPackagePrice: number;
  numCats: number;
}

export const Cat_food_calculatorInputSchema = z.object({
  catWeight: z.number().default(4),
  dailyFoodPerKg: z.number().default(15),
  foodPackageWeight: z.number().default(2),
  foodPackagePrice: z.number().default(150),
  numCats: z.number().default(1),
});

function evaluateAllFormulas(input: Cat_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.catWeight * input.dailyFoodPerKg * input.numCats; results["dailyFoodAmount"] = Number.isFinite(v) ? v : 0; } catch { results["dailyFoodAmount"] = 0; }
  try { const v = (input.catWeight * input.dailyFoodPerKg * input.numCats / 1000) / input.foodPackageWeight * input.foodPackagePrice; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (input.catWeight * input.dailyFoodPerKg * input.numCats / 1000) / input.foodPackageWeight * input.foodPackagePrice * 30; results["monthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  return results;
}


export function calculateCat_food_calculator(input: Cat_food_calculatorInput): Cat_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyCost"] ?? 0;
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


export interface Cat_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
