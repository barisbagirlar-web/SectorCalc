// Auto-generated from cocktail-calculator-schema.json
import * as z from 'zod';

export interface Cocktail_calculatorInput {
  numberOfCocktails: number;
  drinkVolume: number;
  ingredient1Part: number;
  ingredient2Part: number;
  ingredient3Part: number;
  ingredient4Part: number;
  wastagePercentage: number;
  dataConfidence?: number;
}

export const Cocktail_calculatorInputSchema = z.object({
  numberOfCocktails: z.number().default(10),
  drinkVolume: z.number().default(200),
  ingredient1Part: z.number().default(2),
  ingredient2Part: z.number().default(1),
  ingredient3Part: z.number().default(1.5),
  ingredient4Part: z.number().default(0),
  wastagePercentage: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cocktail_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfCocktails * input.drinkVolume * input.ingredient1Part * input.ingredient2Part; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.numberOfCocktails * input.drinkVolume * input.ingredient1Part * input.ingredient2Part * (input.ingredient3Part * input.ingredient4Part * (input.wastagePercentage / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ingredient3Part * input.ingredient4Part * (input.wastagePercentage / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCocktail_calculator(input: Cocktail_calculatorInput): Cocktail_calculatorOutput {
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


export interface Cocktail_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
