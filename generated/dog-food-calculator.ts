// Auto-generated from dog-food-calculator-schema.json
import * as z from 'zod';

export interface Dog_food_calculatorInput {
  weight: number;
  activityFactor: number;
  ageMultiplier: number;
  foodEnergyDensity: number;
  dataConfidence?: number;
}

export const Dog_food_calculatorInputSchema = z.object({
  weight: z.number().default(20),
  activityFactor: z.number().default(1.6),
  ageMultiplier: z.number().default(1),
  foodEnergyDensity: z.number().default(350),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dog_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.activityFactor * input.ageMultiplier * input.foodEnergyDensity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.weight * input.activityFactor * input.ageMultiplier * input.foodEnergyDensity; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDog_food_calculator(input: Dog_food_calculatorInput): Dog_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Dog_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
