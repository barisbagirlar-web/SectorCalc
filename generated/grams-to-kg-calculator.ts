// Auto-generated from grams-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Grams_to_kg_calculatorInput {
  grossWeightGrams: number;
  tareWeightGrams: number;
  decimalPlaces: number;
  roundingMode: number;
}

export const Grams_to_kg_calculatorInputSchema = z.object({
  grossWeightGrams: z.number().default(0),
  tareWeightGrams: z.number().default(0),
  decimalPlaces: z.number().default(3),
  roundingMode: z.number().default(0),
});

function evaluateAllFormulas(input: Grams_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossWeightGrams - input.tareWeightGrams; results["netGrams"] = Number.isFinite(v) ? v : 0; } catch { results["netGrams"] = 0; }
  try { const v = (results["netGrams"] ?? 0) / 1000; results["kgUnrounded"] = Number.isFinite(v) ? v : 0; } catch { results["kgUnrounded"] = 0; }
  try { const v = input.roundingMode === 0 ? Math.round((results["kgUnrounded"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : input.roundingMode === 1 ? Math.floor((results["kgUnrounded"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : Math.ceil((results["kgUnrounded"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["netWeightKg"] = Number.isFinite(v) ? v : 0; } catch { results["netWeightKg"] = 0; }
  try { const v = (results["netGrams"] ?? 0); results["netWeightGrams"] = Number.isFinite(v) ? v : 0; } catch { results["netWeightGrams"] = 0; }
  try { const v = input.grossWeightGrams / 1000; results["grossWeightKg"] = Number.isFinite(v) ? v : 0; } catch { results["grossWeightKg"] = 0; }
  return results;
}


export function calculateGrams_to_kg_calculator(input: Grams_to_kg_calculatorInput): Grams_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netWeightKg"] ?? 0;
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


export interface Grams_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
