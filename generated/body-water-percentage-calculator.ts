// Auto-generated from body-water-percentage-calculator-schema.json
import * as z from 'zod';

export interface Body_water_percentage_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
}

export const Body_water_percentage_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Body_water_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - input.gender) * (-2.097 + 0.1069 * input.height + 0.2466 * input.weight) + input.gender * (2.447 - 0.09156 * input.age + 0.1074 * input.height + 0.3362 * input.weight); results["totalBodyWater"] = Number.isFinite(v) ? v : 0; } catch { results["totalBodyWater"] = 0; }
  try { const v = (((1 - input.gender) * (-2.097 + 0.1069 * input.height + 0.2466 * input.weight) + input.gender * (2.447 - 0.09156 * input.age + 0.1074 * input.height + 0.3362 * input.weight)) / input.weight) * 100; results["bodyWaterPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["bodyWaterPercentage"] = 0; }
  return results;
}


export function calculateBody_water_percentage_calculator(input: Body_water_percentage_calculatorInput): Body_water_percentage_calculatorOutput {
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


export interface Body_water_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
