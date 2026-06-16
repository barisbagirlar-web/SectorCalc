// Auto-generated from pennyweights-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Pennyweights_to_grams_calculatorInput {
  pennyweight: number;
  conversionFactor: number;
  decimalPrecision: number;
  sampleCount: number;
  tolerance: number;
}

export const Pennyweights_to_grams_calculatorInputSchema = z.object({
  pennyweight: z.number().default(1),
  conversionFactor: z.number().default(1.55517384),
  decimalPrecision: z.number().default(2),
  sampleCount: z.number().default(1),
  tolerance: z.number().default(0.001),
});

function evaluateAllFormulas(input: Pennyweights_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pennyweight * input.conversionFactor; results["gramsPerSample"] = Number.isFinite(v) ? v : 0; } catch { results["gramsPerSample"] = 0; }
  try { const v = (results["gramsPerSample"] ?? 0) * input.sampleCount; results["totalGrams"] = Number.isFinite(v) ? v : 0; } catch { results["totalGrams"] = 0; }
  try { const v = parseFloat((results["totalGrams"] ?? 0).toFixed(input.decimalPrecision)); results["roundedTotalGrams"] = Number.isFinite(v) ? v : 0; } catch { results["roundedTotalGrams"] = 0; }
  return results;
}


export function calculatePennyweights_to_grams_calculator(input: Pennyweights_to_grams_calculatorInput): Pennyweights_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedTotalGrams"] ?? 0;
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


export interface Pennyweights_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
