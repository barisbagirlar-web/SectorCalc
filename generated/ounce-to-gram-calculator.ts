// Auto-generated from ounce-to-gram-calculator-schema.json
import * as z from 'zod';

export interface Ounce_to_gram_calculatorInput {
  ounces: number;
  conversionMode: number;
  precision: number;
  roundingMode: number;
}

export const Ounce_to_gram_calculatorInputSchema = z.object({
  ounces: z.number().default(1),
  conversionMode: z.number().default(0),
  precision: z.number().default(2),
  roundingMode: z.number().default(0),
});

function evaluateAllFormulas(input: Ounce_to_gram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.roundingMode === 0 ? Math.round(input.ounces * (input.conversionMode === 0 ? 28.3495 : 31.1035) * Math.pow(10, input.precision)) / Math.pow(10, input.precision) : (input.roundingMode === 1 ? Math.floor(input.ounces * (input.conversionMode === 0 ? 28.3495 : 31.1035) * Math.pow(10, input.precision)) / Math.pow(10, input.precision) : Math.ceil(input.ounces * (input.conversionMode === 0 ? 28.3495 : 31.1035) * Math.pow(10, input.precision)) / Math.pow(10, input.precision))); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateOunce_to_gram_calculator(input: Ounce_to_gram_calculatorInput): Ounce_to_gram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Grams"] ?? 0;
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


export interface Ounce_to_gram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
