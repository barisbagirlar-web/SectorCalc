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

function evaluateAllFormulas(input: Cocktail_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredient1Part + input.ingredient2Part + input.ingredient3Part + input.ingredient4Part; results["totalParts"] = Number.isFinite(v) ? v : 0; } catch { results["totalParts"] = 0; }
  try { const v = input.numberOfCocktails * input.drinkVolume; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) * (1 + (input.wastagePercentage / 100)); results["totalVolumeWithWastage"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolumeWithWastage"] = 0; }
  try { const v = (results["totalVolumeWithWastage"] ?? 0) / (results["totalParts"] ?? 0); results["volumePerPart"] = Number.isFinite(v) ? v : 0; } catch { results["volumePerPart"] = 0; }
  try { const v = input.ingredient1Part * (results["volumePerPart"] ?? 0); results["ingredient1Total"] = Number.isFinite(v) ? v : 0; } catch { results["ingredient1Total"] = 0; }
  try { const v = input.ingredient2Part * (results["volumePerPart"] ?? 0); results["ingredient2Total"] = Number.isFinite(v) ? v : 0; } catch { results["ingredient2Total"] = 0; }
  try { const v = input.ingredient3Part * (results["volumePerPart"] ?? 0); results["ingredient3Total"] = Number.isFinite(v) ? v : 0; } catch { results["ingredient3Total"] = 0; }
  try { const v = input.ingredient4Part * (results["volumePerPart"] ?? 0); results["ingredient4Total"] = Number.isFinite(v) ? v : 0; } catch { results["ingredient4Total"] = 0; }
  return results;
}


export function calculateCocktail_calculator(input: Cocktail_calculatorInput): Cocktail_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVolumeWithWastage"] ?? 0;
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


export interface Cocktail_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
