// Auto-generated from gravity-assist-calculator-schema.json
import * as z from 'zod';

export interface Gravity_assist_calculatorInput {
  v_planet: number;
  v_inf: number;
  r_p: number;
  mu: number;
}

export const Gravity_assist_calculatorInputSchema = z.object({
  v_planet: z.number().default(29.8),
  v_inf: z.number().default(3),
  r_p: z.number().default(6671),
  mu: z.number().default(398600.4418),
});

function evaluateAllFormulas(input: Gravity_assist_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * Math.asin(1 / (1 + (input.r_p * Math.pow(input.v_inf, 2)) / input.mu)); results["delta"] = Number.isFinite(v) ? v : 0; } catch { results["delta"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.v_planet, 2) + Math.pow(input.v_inf, 2) + 2 * input.v_planet * input.v_inf * Math.cos((results["delta"] ?? 0))); results["v_out"] = Number.isFinite(v) ? v : 0; } catch { results["v_out"] = 0; }
  try { const v = 2 * input.v_inf * Math.sin((results["delta"] ?? 0) / 2); results["dv"] = Number.isFinite(v) ? v : 0; } catch { results["dv"] = 0; }
  return results;
}


export function calculateGravity_assist_calculator(input: Gravity_assist_calculatorInput): Gravity_assist_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["v_out"] ?? 0;
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


export interface Gravity_assist_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
