// Auto-generated from ounce-to-gram-calculator-schema.json
import * as z from 'zod';

export interface Ounce_to_gram_calculatorInput {
  ounces: number;
  conversionFactor: number;
  itemCount: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Ounce_to_gram_calculatorInputSchema = z.object({
  ounces: z.number().default(1),
  conversionFactor: z.number().default(28.349523125),
  itemCount: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ounce_to_gram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ounces * input.itemCount; results["totalOunces"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalOunces"] = 0; }
  try { const v = input.ounces * input.conversionFactor * input.itemCount; results["unroundedGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unroundedGrams"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOunce_to_gram_calculator(input: Ounce_to_gram_calculatorInput): Ounce_to_gram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["unroundedGrams"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Ounce_to_gram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
