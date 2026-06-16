// Auto-generated from body-volume-index-calculator-schema.json
import * as z from 'zod';

export interface Body_volume_index_calculatorInput {
  height: number;
  weight: number;
  waist: number;
  hip: number;
  chest: number;
}

export const Body_volume_index_calculatorInputSchema = z.object({
  height: z.number().default(170),
  weight: z.number().default(70),
  waist: z.number().default(80),
  hip: z.number().default(95),
  chest: z.number().default(100),
});

function evaluateAllFormulas(input: Body_volume_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.002 * input.height + 0.001 * input.weight + 0.005 * input.waist + 0.01 * input.hip + 0.003 * input.chest - 15; results["bodyVolume"] = Number.isFinite(v) ? v : 0; } catch { results["bodyVolume"] = 0; }
  try { const v = (results["bodyVolume"] ?? 0) / ((input.height / 100) ** 2); results["bvi"] = Number.isFinite(v) ? v : 0; } catch { results["bvi"] = 0; }
  return results;
}


export function calculateBody_volume_index_calculator(input: Body_volume_index_calculatorInput): Body_volume_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bvi"] ?? 0;
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


export interface Body_volume_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
