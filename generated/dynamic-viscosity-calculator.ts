// Auto-generated from dynamic-viscosity-calculator-schema.json
import * as z from 'zod';

export interface Dynamic_viscosity_calculatorInput {
  tRef: number;
  muRef: number;
  activationEnergy: number;
  temp: number;
}

export const Dynamic_viscosity_calculatorInputSchema = z.object({
  tRef: z.number().default(293),
  muRef: z.number().default(0.001002),
  activationEnergy: z.number().default(16000),
  temp: z.number().default(313),
});

function evaluateAllFormulas(input: Dynamic_viscosity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.exp((input.activationEnergy / 8.314) * (1/input.temp - 1/input.tRef)); results["exponentialFactor"] = Number.isFinite(v) ? v : 0; } catch { results["exponentialFactor"] = 0; }
  try { const v = input.muRef * Math.exp((input.activationEnergy / 8.314) * (1/input.temp - 1/input.tRef)); results["dynamicViscosity"] = Number.isFinite(v) ? v : 0; } catch { results["dynamicViscosity"] = 0; }
  try { const v = input.muRef * 1000 * Math.exp((input.activationEnergy / 8.314) * (1/input.temp - 1/input.tRef)); results["dynamicViscosity_cP"] = Number.isFinite(v) ? v : 0; } catch { results["dynamicViscosity_cP"] = 0; }
  return results;
}


export function calculateDynamic_viscosity_calculator(input: Dynamic_viscosity_calculatorInput): Dynamic_viscosity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dynamicViscosity"] ?? 0;
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


export interface Dynamic_viscosity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
