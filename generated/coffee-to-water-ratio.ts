// Auto-generated from coffee-to-water-ratio-schema.json
import * as z from 'zod';

export interface Coffee_to_water_ratioInput {
  coffeeWeight: number;
  waterVolume: number;
  absorptionFactor: number;
  targetRatio: number;
}

export const Coffee_to_water_ratioInputSchema = z.object({
  coffeeWeight: z.number().default(20),
  waterVolume: z.number().default(300),
  absorptionFactor: z.number().default(2),
  targetRatio: z.number().default(15),
});

function evaluateAllFormulas(input: Coffee_to_water_ratioInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.waterVolume / input.coffeeWeight; results["actualRatio"] = Number.isFinite(v) ? v : 0; } catch { results["actualRatio"] = 0; }
  try { const v = input.waterVolume - input.coffeeWeight * input.absorptionFactor; results["brewYield"] = Number.isFinite(v) ? v : 0; } catch { results["brewYield"] = 0; }
  try { const v = Math.abs(input.waterVolume / input.coffeeWeight - input.targetRatio); results["ratioDeviation"] = Number.isFinite(v) ? v : 0; } catch { results["ratioDeviation"] = 0; }
  try { const v = Math.abs(input.waterVolume / input.coffeeWeight - input.targetRatio) < 0.01; results["targetAchieved"] = Number.isFinite(v) ? v : 0; } catch { results["targetAchieved"] = 0; }
  return results;
}


export function calculateCoffee_to_water_ratio(input: Coffee_to_water_ratioInput): Coffee_to_water_ratioOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["actualRatio"] ?? 0;
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


export interface Coffee_to_water_ratioOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
