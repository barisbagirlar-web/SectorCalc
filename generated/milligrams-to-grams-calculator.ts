// Auto-generated from milligrams-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Milligrams_to_grams_calculatorInput {
  inputMilligrams: number;
  conversionFactor: number;
  decimalPlaces: number;
  batchMultiplier: number;
  roundingMode: number;
}

export const Milligrams_to_grams_calculatorInputSchema = z.object({
  inputMilligrams: z.number().default(0),
  conversionFactor: z.number().default(0.001),
  decimalPlaces: z.number().default(3),
  batchMultiplier: z.number().default(1),
  roundingMode: z.number().default(0),
});

function evaluateAllFormulas(input: Milligrams_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputMilligrams * input.conversionFactor * input.batchMultiplier; results["rawGrams"] = Number.isFinite(v) ? v : 0; } catch { results["rawGrams"] = 0; }
  try { const v = input.roundingMode == 0 ? Math.round((results["rawGrams"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : input.roundingMode == 1 ? Math.floor((results["rawGrams"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : Math.ceil((results["rawGrams"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["grams"] = Number.isFinite(v) ? v : 0; } catch { results["grams"] = 0; }
  try { const v = input.inputMilligrams; results["inputMilligrams"] = Number.isFinite(v) ? v : 0; } catch { results["inputMilligrams"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.batchMultiplier; results["batchMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["batchMultiplier"] = 0; }
  return results;
}


export function calculateMilligrams_to_grams_calculator(input: Milligrams_to_grams_calculatorInput): Milligrams_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grams"] ?? 0;
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


export interface Milligrams_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
