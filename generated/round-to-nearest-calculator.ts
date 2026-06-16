// Auto-generated from round-to-nearest-calculator-schema.json
import * as z from 'zod';

export interface Round_to_nearest_calculatorInput {
  value: number;
  nearest: number;
  offset: number;
  decimals: number;
}

export const Round_to_nearest_calculatorInputSchema = z.object({
  value: z.number().default(123.456),
  nearest: z.number().default(0.5),
  offset: z.number().default(0),
  decimals: z.number().default(2),
});

function evaluateAllFormulas(input: Round_to_nearest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.value - input.offset) / input.nearest; results["adjustedValue"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedValue"] = 0; }
  try { const v = Math.round((results["adjustedValue"] ?? 0)); results["roundedMultiple"] = Number.isFinite(v) ? v : 0; } catch { results["roundedMultiple"] = 0; }
  try { const v = parseFloat(((results["roundedMultiple"] ?? 0) * input.nearest + input.offset).toFixed(input.decimals)); results["roundedValue"] = Number.isFinite(v) ? v : 0; } catch { results["roundedValue"] = 0; }
  return results;
}


export function calculateRound_to_nearest_calculator(input: Round_to_nearest_calculatorInput): Round_to_nearest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedValue"] ?? 0;
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


export interface Round_to_nearest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
