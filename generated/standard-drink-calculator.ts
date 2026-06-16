// Auto-generated from standard-drink-calculator-schema.json
import * as z from 'zod';

export interface Standard_drink_calculatorInput {
  volume: number;
  abv: number;
  standardGrams: number;
  quantity: number;
}

export const Standard_drink_calculatorInputSchema = z.object({
  volume: z.number().default(330),
  abv: z.number().default(5),
  standardGrams: z.number().default(14),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Standard_drink_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume * (input.abv / 100) * 0.789; results["gramsAlcohol"] = Number.isFinite(v) ? v : 0; } catch { results["gramsAlcohol"] = 0; }
  try { const v = ((results["gramsAlcohol"] ?? 0) * input.quantity) / input.standardGrams; results["totalStandardDrinks"] = Number.isFinite(v) ? v : 0; } catch { results["totalStandardDrinks"] = 0; }
  return results;
}


export function calculateStandard_drink_calculator(input: Standard_drink_calculatorInput): Standard_drink_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalStandardDrinks"] ?? 0;
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


export interface Standard_drink_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
