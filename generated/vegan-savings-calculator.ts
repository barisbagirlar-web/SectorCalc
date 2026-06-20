// Auto-generated from vegan-savings-calculator-schema.json
import * as z from 'zod';

export interface Vegan_savings_calculatorInput {
  numMeals: number;
  co2MeatPerMeal: number;
  co2VeganPerMeal: number;
  costMeatPerMeal: number;
  costVeganPerMeal: number;
  weeks: number;
  dataConfidence?: number;
}

export const Vegan_savings_calculatorInputSchema = z.object({
  numMeals: z.number().default(10),
  co2MeatPerMeal: z.number().default(5),
  co2VeganPerMeal: z.number().default(2),
  costMeatPerMeal: z.number().default(8),
  costVeganPerMeal: z.number().default(5.5),
  weeks: z.number().default(52),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vegan_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numMeals * input.weeks; results["totalMeals"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMeals"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMeals"])) * (input.co2MeatPerMeal - input.co2VeganPerMeal); results["co2Savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["co2Savings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMeals"])) * (input.costMeatPerMeal - input.costVeganPerMeal); results["costSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costSavings"] = Number.NaN; }
  try { const v = 'Total CO2 Savings: ' + (toNumericFormulaValue(results["co2Savings"])) + ' kg CO2, Total Cost Savings: $' + (toNumericFormulaValue(results["costSavings"])); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = 'Meat-based total CO2: ' + (input.numMeals * input.weeks * input.co2MeatPerMeal) + ' kg CO2, Cost: $' + (input.numMeals * input.weeks * input.costMeatPerMeal); results["breakdown1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown1"] = Number.NaN; }
  try { const v = 'Vegan total CO2: ' + (input.numMeals * input.weeks * input.co2VeganPerMeal) + ' kg CO2, Cost: $' + (input.numMeals * input.weeks * input.costVeganPerMeal); results["breakdown2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown2"] = Number.NaN; }
  return results;
}


export function calculateVegan_savings_calculator(input: Vegan_savings_calculatorInput): Vegan_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMeals"]);
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


export interface Vegan_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
