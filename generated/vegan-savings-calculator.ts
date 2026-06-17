// Auto-generated from vegan-savings-calculator-schema.json
import * as z from 'zod';

export interface Vegan_savings_calculatorInput {
  numMeals: number;
  co2MeatPerMeal: number;
  co2VeganPerMeal: number;
  costMeatPerMeal: number;
  costVeganPerMeal: number;
  weeks: number;
}

export const Vegan_savings_calculatorInputSchema = z.object({
  numMeals: z.number().default(10),
  co2MeatPerMeal: z.number().default(5),
  co2VeganPerMeal: z.number().default(2),
  costMeatPerMeal: z.number().default(8),
  costVeganPerMeal: z.number().default(5.5),
  weeks: z.number().default(52),
});

function evaluateAllFormulas(input: Vegan_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numMeals * input.weeks; results["totalMeals"] = Number.isFinite(v) ? v : 0; } catch { results["totalMeals"] = 0; }
  try { const v = (results["totalMeals"] ?? 0) * (input.co2MeatPerMeal - input.co2VeganPerMeal); results["co2Savings"] = Number.isFinite(v) ? v : 0; } catch { results["co2Savings"] = 0; }
  try { const v = (results["totalMeals"] ?? 0) * (input.costMeatPerMeal - input.costVeganPerMeal); results["costSavings"] = Number.isFinite(v) ? v : 0; } catch { results["costSavings"] = 0; }
  try { const v = 'Total CO2 Savings: ' + (results["co2Savings"] ?? 0) + ' kg CO2, Total Cost Savings: $' + (results["costSavings"] ?? 0); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = 'Meat-based total CO2: ' + (input.numMeals * input.weeks * input.co2MeatPerMeal) + ' kg CO2, Cost: $' + (input.numMeals * input.weeks * input.costMeatPerMeal); results["breakdown1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = 'Vegan total CO2: ' + (input.numMeals * input.weeks * input.co2VeganPerMeal) + ' kg CO2, Cost: $' + (input.numMeals * input.weeks * input.costVeganPerMeal); results["breakdown2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown2"] = 0; }
  results["_formulas_breakdown1_"] = 0;
  results["_formulas_breakdown2_"] = 0;
  return results;
}


export function calculateVegan_savings_calculator(input: Vegan_savings_calculatorInput): Vegan_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMeals"] ?? 0;
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


export interface Vegan_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
