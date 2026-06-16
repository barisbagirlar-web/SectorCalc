// Auto-generated from body-water-percentage-schema.json
import * as z from 'zod';

export interface Body_water_percentageInput {
  gender: number;
  age: number;
  height: number;
  weight: number;
}

export const Body_water_percentageInputSchema = z.object({
  gender: z.number().default(1),
  age: z.number().default(30),
  height: z.number().default(170),
  weight: z.number().default(70),
});

function evaluateAllFormulas(input: Body_water_percentageInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender * (2.447 - 0.09156 * input.age + 0.1074 * input.height + 0.3362 * input.weight) + (1 - input.gender) * (-2.097 + 0.1069 * input.height + 0.2466 * input.weight); results["totalBodyWater"] = Number.isFinite(v) ? v : 0; } catch { results["totalBodyWater"] = 0; }
  try { const v = (input.gender * (2.447 - 0.09156 * input.age + 0.1074 * input.height + 0.3362 * input.weight) + (1 - input.gender) * (-2.097 + 0.1069 * input.height + 0.2466 * input.weight)) / input.weight * 100; results["bodyWaterPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["bodyWaterPercentage"] = 0; }
  return results;
}


export function calculateBody_water_percentage(input: Body_water_percentageInput): Body_water_percentageOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bodyWaterPercentage"] ?? 0;
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


export interface Body_water_percentageOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
