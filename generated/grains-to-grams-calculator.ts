// Auto-generated from grains-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Grains_to_grams_calculatorInput {
  grains: number;
  conversionFactor: number;
  precision: number;
  batchCount: number;
}

export const Grains_to_grams_calculatorInputSchema = z.object({
  grains: z.number().default(0),
  conversionFactor: z.number().default(0.06479891),
  precision: z.number().default(2),
  batchCount: z.number().default(1),
});

function evaluateAllFormulas(input: Grains_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.grains * input.conversionFactor * input.batchCount * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.conversionFactor; results["gramsPerGrain"] = Number.isFinite(v) ? v : 0; } catch { results["gramsPerGrain"] = 0; }
  try { const v = input.grains * input.batchCount; results["totalGrains"] = Number.isFinite(v) ? v : 0; } catch { results["totalGrains"] = 0; }
  try { const v = input.grains * input.conversionFactor * input.batchCount; results["unroundedGrams"] = Number.isFinite(v) ? v : 0; } catch { results["unroundedGrams"] = 0; }
  return results;
}


export function calculateGrains_to_grams_calculator(input: Grains_to_grams_calculatorInput): Grains_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Grains_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
