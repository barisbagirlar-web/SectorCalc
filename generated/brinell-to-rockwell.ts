// Auto-generated from brinell-to-rockwell-schema.json
import * as z from 'zod';

export interface Brinell_to_rockwellInput {
  hbw: number;
  scale: number;
}

export const Brinell_to_rockwellInputSchema = z.object({
  hbw: z.number().default(200),
  scale: z.number().default(1),
});

function evaluateAllFormulas(input: Brinell_to_rockwellInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scale === 1 ? (100 * input.hbw) / (input.hbw + 100) : input.scale === 2 ? (130 - 30 * Math.sqrt(input.hbw)) : (100 * input.hbw) / (input.hbw + 100) - 10; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateBrinell_to_rockwell(input: Brinell_to_rockwellInput): Brinell_to_rockwellOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Rockwell"] ?? 0;
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


export interface Brinell_to_rockwellOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
