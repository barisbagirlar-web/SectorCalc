// Auto-generated from tablespoons-to-ml-calculator-schema.json
import * as z from 'zod';

export interface Tablespoons_to_ml_calculatorInput {
  tablespoons: number;
  batchSize: number;
  conversionType: number;
  precision: number;
  customFactor: number;
}

export const Tablespoons_to_ml_calculatorInputSchema = z.object({
  tablespoons: z.number().default(1),
  batchSize: z.number().default(1),
  conversionType: z.number().default(1),
  precision: z.number().default(2),
  customFactor: z.number().default(0),
});

function evaluateAllFormulas(input: Tablespoons_to_ml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.customFactor > 0 ? input.customFactor : (input.conversionType === 1 ? 14.7868 : input.conversionType === 2 ? 15 : input.conversionType === 3 ? 17.7582 : 20); results["conversionFactorUsed"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactorUsed"] = 0; }
  try { const v = input.tablespoons * input.batchSize; results["totalTablespoons"] = Number.isFinite(v) ? v : 0; } catch { results["totalTablespoons"] = 0; }
  try { const v = Math.round((results["totalTablespoons"] ?? 0) * (results["conversionFactorUsed"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["milliliters"] = Number.isFinite(v) ? v : 0; } catch { results["milliliters"] = 0; }
  return results;
}


export function calculateTablespoons_to_ml_calculator(input: Tablespoons_to_ml_calculatorInput): Tablespoons_to_ml_calculatorOutput {
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


export interface Tablespoons_to_ml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
