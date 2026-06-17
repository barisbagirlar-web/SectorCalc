// Auto-generated from mpg-to-l-per-100km-schema.json
import * as z from 'zod';

export interface Mpg_to_l_per_100kmInput {
  mpg: number;
  fuelType: number;
  auto_input_3: number;
}

export const Mpg_to_l_per_100kmInputSchema = z.object({
  mpg: z.number().default(25),
  fuelType: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Mpg_to_l_per_100kmInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 235.214583 / (input.mpg * input.fuelType); results["litersPer100km"] = Number.isFinite(v) ? v : 0; } catch { results["litersPer100km"] = 0; }
  try { const v = 235.214583 / (input.mpg * input.fuelType); results["litersPer100km___235_214583____mpg___fue"] = Number.isFinite(v) ? v : 0; } catch { results["litersPer100km___235_214583____mpg___fue"] = 0; }
  return results;
}


export function calculateMpg_to_l_per_100km(input: Mpg_to_l_per_100kmInput): Mpg_to_l_per_100kmOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["litersPer100km"] ?? 0;
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


export interface Mpg_to_l_per_100kmOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
