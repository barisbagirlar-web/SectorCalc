// Auto-generated from food-waste-calculator-schema.json
import * as z from 'zod';

export interface Food_waste_calculatorInput {
  totalFoodProduced: number;
  totalFoodWasted: number;
  costPerKg: number;
  mealsServed: number;
  dataConfidence?: number;
}

export const Food_waste_calculatorInputSchema = z.object({
  totalFoodProduced: z.number().default(0),
  totalFoodWasted: z.number().default(0),
  costPerKg: z.number().default(0),
  mealsServed: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Food_waste_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalFoodWasted * input.costPerKg; results["totalWasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWasteCost"] = Number.NaN; }
  try { const v = input.totalFoodProduced !== 0 ? (input.totalFoodWasted / input.totalFoodProduced) * 100 : 0; results["wastePercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastePercentage"] = Number.NaN; }
  try { const v = ((input.mealsServed !== 0 ? input.totalFoodWasted / input.mealsServed : 0) ? 1 : 0); results["wastePerMealKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastePerMealKg"] = Number.NaN; }
  try { const v = ((input.mealsServed !== 0 ? (input.totalFoodWasted * input.costPerKg) / input.mealsServed : 0) ? 1 : 0); results["wasteCostPerMeal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteCostPerMeal"] = Number.NaN; }
  return results;
}


export function calculateFood_waste_calculator(input: Food_waste_calculatorInput): Food_waste_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWasteCost"]);
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


export interface Food_waste_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
