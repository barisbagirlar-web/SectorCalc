// Auto-generated from liters-to-gallons-schema.json
import * as z from 'zod';

export interface Liters_to_gallonsInput {
  volume_liters: number;
  conversion_type: number;
  auto_input_3: number;
}

export const Liters_to_gallonsInputSchema = z.object({
  volume_liters: z.number().default(1),
  conversion_type: z.number().default(1),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Liters_to_gallonsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume_liters * 0.264172; results["gallons_us"] = Number.isFinite(v) ? v : 0; } catch { results["gallons_us"] = 0; }
  try { const v = input.volume_liters * 0.219969; results["gallons_uk"] = Number.isFinite(v) ? v : 0; } catch { results["gallons_uk"] = 0; }
  try { const v = input.conversion_type === 1 ? (results["gallons_us"] ?? 0) : (results["gallons_uk"] ?? 0); results["gallons_selected"] = Number.isFinite(v) ? v : 0; } catch { results["gallons_selected"] = 0; }
  return results;
}


export function calculateLiters_to_gallons(input: Liters_to_gallonsInput): Liters_to_gallonsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gallons_selected"] ?? 0;
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


export interface Liters_to_gallonsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
