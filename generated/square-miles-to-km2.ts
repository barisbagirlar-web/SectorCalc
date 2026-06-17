// Auto-generated from square-miles-to-km2-schema.json
import * as z from 'zod';

export interface Square_miles_to_km2Input {
  square_miles: number;
  auto_input_2: number;
  auto_input_3: number;
}

export const Square_miles_to_km2InputSchema = z.object({
  square_miles: z.number().default(1),
  auto_input_2: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Square_miles_to_km2Input): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.square_miles * 2.589988110336; results["km2"] = Number.isFinite(v) ? v : 0; } catch { results["km2"] = 0; }
  try { const v = input.square_miles * 2.589988110336; results["km2_copy"] = Number.isFinite(v) ? v : 0; } catch { results["km2_copy"] = 0; }
  return results;
}


export function calculateSquare_miles_to_km2(input: Square_miles_to_km2Input): Square_miles_to_km2Output {
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


export interface Square_miles_to_km2Output {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
