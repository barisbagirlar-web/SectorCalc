// Auto-generated from ml-to-cups-calculator-schema.json
import * as z from 'zod';

export interface Ml_to_cups_calculatorInput {
  milliliters: number;
  cupSize: number;
  decimals: number;
  quantity: number;
}

export const Ml_to_cups_calculatorInputSchema = z.object({
  milliliters: z.number().default(0),
  cupSize: z.number().default(236.5882365),
  decimals: z.number().default(2),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Ml_to_cups_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.milliliters * input.quantity; results["totalMl"] = Number.isFinite(v) ? v : 0; } catch { results["totalMl"] = 0; }
  try { const v = (results["totalMl"] ?? 0) / input.cupSize; results["rawCups"] = Number.isFinite(v) ? v : 0; } catch { results["rawCups"] = 0; }
  try { const v = Math.round((results["rawCups"] ?? 0) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["roundedCups"] = Number.isFinite(v) ? v : 0; } catch { results["roundedCups"] = 0; }
  return results;
}


export function calculateMl_to_cups_calculator(input: Ml_to_cups_calculatorInput): Ml_to_cups_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedCups"] ?? 0;
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


export interface Ml_to_cups_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
