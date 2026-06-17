// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cocktail_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.numberOfCocktails + input.drinkVolume + input.ingredient1Part; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.numberOfCocktails + input.drinkVolume + input.ingredient1Part; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCocktail_calculator(input: Cocktail_calculatorInput): Cocktail_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
