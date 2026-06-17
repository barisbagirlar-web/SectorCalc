// Auto-generated from specific-impulse-calculator-schema.json
import * as z from 'zod';

export interface Specific_impulse_calculatorInput {
  thrust: number;
  massFlowRate: number;
  standardGravity: number;
}

export const Specific_impulse_calculatorInputSchema = z.object({
  thrust: z.number(),
  massFlowRate: z.number(),
  standardGravity: z.number().default(9.80665),
});

function evaluateAllFormulas(input: Specific_impulse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.thrust / (input.massFlowRate * input.standardGravity); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  results["Isp___F________g__"] = 0;
  results["Divide_thrust_by_the_product_of_mass_flo"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateSpecific_impulse_calculator(input: Specific_impulse_calculatorInput): Specific_impulse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Specific_impulse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
