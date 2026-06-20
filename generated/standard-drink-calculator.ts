// Auto-generated from standard-drink-calculator-schema.json
import * as z from 'zod';

export interface Standard_drink_calculatorInput {
  volume: number;
  abv: number;
  standardGrams: number;
  quantity: number;
  dataConfidence?: number;
}

export const Standard_drink_calculatorInputSchema = z.object({
  volume: z.number().default(330),
  abv: z.number().default(5),
  standardGrams: z.number().default(14),
  quantity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standard_drink_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume * (input.abv / 100) * 0.789; results["gramsAlcohol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gramsAlcohol"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["gramsAlcohol"])) * input.quantity) / input.standardGrams; results["totalStandardDrinks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalStandardDrinks"] = Number.NaN; }
  return results;
}


export function calculateStandard_drink_calculator(input: Standard_drink_calculatorInput): Standard_drink_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalStandardDrinks"]);
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


export interface Standard_drink_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
