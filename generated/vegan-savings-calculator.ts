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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vegan_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numMeals * input.weeks; results["totalMeals"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMeals"] = 0; }
  try { const v = (asFormulaNumber(results["totalMeals"])) * (input.co2MeatPerMeal - input.co2VeganPerMeal); results["co2Savings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["co2Savings"] = 0; }
  try { const v = (asFormulaNumber(results["totalMeals"])) * (input.costMeatPerMeal - input.costVeganPerMeal); results["costSavings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costSavings"] = 0; }
  try { const v = 'Total CO2 Savings: ' + (asFormulaNumber(results["co2Savings"])) + ' kg CO2, Total Cost Savings: $' + (asFormulaNumber(results["costSavings"])); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = 'Meat-based total CO2: ' + (input.numMeals * input.weeks * input.co2MeatPerMeal) + ' kg CO2, Cost: $' + (input.numMeals * input.weeks * input.costMeatPerMeal); results["breakdown1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = 'Vegan total CO2: ' + (input.numMeals * input.weeks * input.co2VeganPerMeal) + ' kg CO2, Cost: $' + (input.numMeals * input.weeks * input.costVeganPerMeal); results["breakdown2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
