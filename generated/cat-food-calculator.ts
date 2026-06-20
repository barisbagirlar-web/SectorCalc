// Auto-generated from cat-food-calculator-schema.json
import * as z from 'zod';

export interface Cat_food_calculatorInput {
  catWeight: number;
  dailyFoodPerKg: number;
  foodPackageWeight: number;
  foodPackagePrice: number;
  numCats: number;
  dataConfidence?: number;
}

export const Cat_food_calculatorInputSchema = z.object({
  catWeight: z.number().default(4),
  dailyFoodPerKg: z.number().default(15),
  foodPackageWeight: z.number().default(2),
  foodPackagePrice: z.number().default(150),
  numCats: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cat_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.catWeight * input.dailyFoodPerKg * input.numCats; results["dailyFoodAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyFoodAmount"] = Number.NaN; }
  try { const v = (input.catWeight * input.dailyFoodPerKg * input.numCats / 1000) / input.foodPackageWeight * input.foodPackagePrice; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCost"] = Number.NaN; }
  try { const v = (input.catWeight * input.dailyFoodPerKg * input.numCats / 1000) / input.foodPackageWeight * input.foodPackagePrice * 30; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyCost"] = Number.NaN; }
  return results;
}


export function calculateCat_food_calculator(input: Cat_food_calculatorInput): Cat_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyCost"]);
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


export interface Cat_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
