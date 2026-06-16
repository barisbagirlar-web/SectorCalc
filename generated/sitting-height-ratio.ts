// Auto-generated from sitting-height-ratio-schema.json
import * as z from 'zod';

export interface Sitting_height_ratioInput {
  total_height: number;
  sitting_height: number;
  shoe_height: number;
  seat_compression: number;
}

export const Sitting_height_ratioInputSchema = z.object({
  total_height: z.number().default(170),
  sitting_height: z.number().default(90),
  shoe_height: z.number().default(0),
  seat_compression: z.number().default(0),
});

function evaluateAllFormulas(input: Sitting_height_ratioInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sitting_height - input.seat_compression; results["effective_sitting_height"] = Number.isFinite(v) ? v : 0; } catch { results["effective_sitting_height"] = 0; }
  try { const v = input.total_height - input.shoe_height; results["effective_total_height"] = Number.isFinite(v) ? v : 0; } catch { results["effective_total_height"] = 0; }
  try { const v = ( (input.sitting_height - input.seat_compression) / (input.total_height - input.shoe_height) ) * 100; results["ratio_percent"] = Number.isFinite(v) ? v : 0; } catch { results["ratio_percent"] = 0; }
  return results;
}


export function calculateSitting_height_ratio(input: Sitting_height_ratioInput): Sitting_height_ratioOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ratio_percent"] ?? 0;
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


export interface Sitting_height_ratioOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
