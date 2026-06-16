// Auto-generated from thrust-to-weight-ratio-calculator-schema.json
import * as z from 'zod';

export interface Thrust_to_weight_ratio_calculatorInput {
  emptyMass: number;
  fuelMass: number;
  payloadMass: number;
  thrust: number;
  gravity: number;
}

export const Thrust_to_weight_ratio_calculatorInputSchema = z.object({
  emptyMass: z.number().default(5000),
  fuelMass: z.number().default(3000),
  payloadMass: z.number().default(2000),
  thrust: z.number().default(120000),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Thrust_to_weight_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.emptyMass + input.fuelMass + input.payloadMass; results["totalMass"] = Number.isFinite(v) ? v : 0; } catch { results["totalMass"] = 0; }
  try { const v = (results["totalMass"] ?? 0) * input.gravity; results["weight"] = Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  try { const v = input.thrust / (results["weight"] ?? 0); results["thrustToWeightRatio"] = Number.isFinite(v) ? v : 0; } catch { results["thrustToWeightRatio"] = 0; }
  return results;
}


export function calculateThrust_to_weight_ratio_calculator(input: Thrust_to_weight_ratio_calculatorInput): Thrust_to_weight_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["thrustToWeightRatio"] ?? 0;
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


export interface Thrust_to_weight_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
