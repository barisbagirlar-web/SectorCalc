// Auto-generated from square-miles-to-square-kilometers-calculator-schema.json
import * as z from 'zod';

export interface Square_miles_to_square_kilometers_calculatorInput {
  sm: number;
  cf: number;
  dp: number;
  sf: number;
  cc: number;
}

export const Square_miles_to_square_kilometers_calculatorInputSchema = z.object({
  sm: z.number().default(0),
  cf: z.number().default(2.589988110336),
  dp: z.number().default(4),
  sf: z.number().default(1),
  cc: z.number().default(0),
});

function evaluateAllFormulas(input: Square_miles_to_square_kilometers_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sm * input.cf; results["rawKm2"] = Number.isFinite(v) ? v : 0; } catch { results["rawKm2"] = 0; }
  try { const v = (results["rawKm2"] ?? 0) * input.sf + input.cc; results["scaledKm2"] = Number.isFinite(v) ? v : 0; } catch { results["scaledKm2"] = 0; }
  try { const v = Math.round((results["scaledKm2"] ?? 0) * Math.pow(10, input.dp)) / Math.pow(10, input.dp); results["km2"] = Number.isFinite(v) ? v : 0; } catch { results["km2"] = 0; }
  return results;
}


export function calculateSquare_miles_to_square_kilometers_calculator(input: Square_miles_to_square_kilometers_calculatorInput): Square_miles_to_square_kilometers_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["km2"] ?? 0;
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


export interface Square_miles_to_square_kilometers_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
