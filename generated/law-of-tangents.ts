// Auto-generated from law-of-tangents-schema.json
import * as z from 'zod';

export interface Law_of_tangentsInput {
  side_a: number;
  side_b: number;
  angle_C: number;
}

export const Law_of_tangentsInputSchema = z.object({
  side_a: z.number().default(1),
  side_b: z.number().default(1),
  angle_C: z.number().default(60),
});

function evaluateAllFormulas(input: Law_of_tangentsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan2(input.side_a * Math.sin(input.angle_C * Math.PI / 180), input.side_b - input.side_a * Math.cos(input.angle_C * Math.PI / 180)) * 180 / Math.PI; results["angle_A"] = Number.isFinite(v) ? v : 0; } catch { results["angle_A"] = 0; }
  try { const v = 180 - (results["angle_A"] ?? 0) - input.angle_C; results["angle_B"] = Number.isFinite(v) ? v : 0; } catch { results["angle_B"] = 0; }
  try { const v = Math.sqrt(input.side_a**2 + input.side_b**2 - 2 * input.side_a * input.side_b * Math.cos(input.angle_C * Math.PI / 180)); results["side_c"] = Number.isFinite(v) ? v : 0; } catch { results["side_c"] = 0; }
  return results;
}


export function calculateLaw_of_tangents(input: Law_of_tangentsInput): Law_of_tangentsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["angle_A"] ?? 0;
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


export interface Law_of_tangentsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
