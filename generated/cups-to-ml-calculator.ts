// Auto-generated from cups-to-ml-calculator-schema.json
import * as z from 'zod';

export interface Cups_to_ml_calculatorInput {
  cups: number;
  cupSize: number;
  precision: number;
  batchSize: number;
  temperature: number;
  altitude: number;
}

export const Cups_to_ml_calculatorInputSchema = z.object({
  cups: z.number().default(1),
  cupSize: z.number().default(236.588),
  precision: z.number().default(2),
  batchSize: z.number().default(1),
  temperature: z.number().default(20),
  altitude: z.number().default(0),
});

function evaluateAllFormulas(input: Cups_to_ml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cups * input.cupSize * input.batchSize + 0 * input.temperature + 0 * input.altitude; results["millilitersUnrounded"] = Number.isFinite(v) ? v : 0; } catch { results["millilitersUnrounded"] = 0; }
  try { const v = Math.round((results["millilitersUnrounded"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["milliliters"] = Number.isFinite(v) ? v : 0; } catch { results["milliliters"] = 0; }
  results["_cupSize__ml_cup"] = 0;
  return results;
}


export function calculateCups_to_ml_calculator(input: Cups_to_ml_calculatorInput): Cups_to_ml_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["millilitersUnrounded"] ?? 0;
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


export interface Cups_to_ml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
