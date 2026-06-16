// Auto-generated from teaspoons-to-ml-calculator-schema.json
import * as z from 'zod';

export interface Teaspoons_to_ml_calculatorInput {
  teaspoons: number;
  mlPerTeaspoon: number;
  decimalPlaces: number;
  numberOfConversions: number;
}

export const Teaspoons_to_ml_calculatorInputSchema = z.object({
  teaspoons: z.number().default(1),
  mlPerTeaspoon: z.number().default(5),
  decimalPlaces: z.number().default(2),
  numberOfConversions: z.number().default(1),
});

function evaluateAllFormulas(input: Teaspoons_to_ml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.teaspoons * input.mlPerTeaspoon * input.numberOfConversions * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateTeaspoons_to_ml_calculator(input: Teaspoons_to_ml_calculatorInput): Teaspoons_to_ml_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["milliliters"] ?? 0;
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


export interface Teaspoons_to_ml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
