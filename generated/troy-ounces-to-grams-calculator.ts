// Auto-generated from troy-ounces-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Troy_ounces_to_grams_calculatorInput {
  troyOunces: number;
  conversionFactor: number;
  precision: number;
  quantity: number;
  dataConfidence?: number;
}

export const Troy_ounces_to_grams_calculatorInputSchema = z.object({
  troyOunces: z.number().default(1),
  conversionFactor: z.number().default(31.1034768),
  precision: z.number().default(2),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Troy_ounces_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.troyOunces * input.conversionFactor * input.quantity; results["rawGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawGrams"] = 0; }
  try { const v = input.troyOunces * input.conversionFactor * input.quantity; results["rawGrams_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawGrams_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTroy_ounces_to_grams_calculator(input: Troy_ounces_to_grams_calculatorInput): Troy_ounces_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawGrams_aux"]);
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


export interface Troy_ounces_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
