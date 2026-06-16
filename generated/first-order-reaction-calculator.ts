// Auto-generated from first-order-reaction-calculator-schema.json
import * as z from 'zod';

export interface First_order_reaction_calculatorInput {
  c0: number;
  k: number;
  t: number;
  order: number;
}

export const First_order_reaction_calculatorInputSchema = z.object({
  c0: z.number().default(1),
  k: z.number().default(0.1),
  t: z.number().default(10),
  order: z.number().default(1),
});

function evaluateAllFormulas(input: First_order_reaction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.c0 * Math.exp(-input.k * input.t); results["c"] = Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = Math.log(2) / input.k; results["halfLife"] = Number.isFinite(v) ? v : 0; } catch { results["halfLife"] = 0; }
  try { const v = ((input.c0 - (results["c"] ?? 0)) / input.c0) * 100; results["conversion"] = Number.isFinite(v) ? v : 0; } catch { results["conversion"] = 0; }
  return results;
}


export function calculateFirst_order_reaction_calculator(input: First_order_reaction_calculatorInput): First_order_reaction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["c"] ?? 0;
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


export interface First_order_reaction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
