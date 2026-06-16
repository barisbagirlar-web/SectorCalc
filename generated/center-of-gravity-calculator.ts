// Auto-generated from center-of-gravity-calculator-schema.json
import * as z from 'zod';

export interface Center_of_gravity_calculatorInput {
  mass1: number;
  x1: number;
  y1: number;
  mass2: number;
  x2: number;
  y2: number;
}

export const Center_of_gravity_calculatorInputSchema = z.object({
  mass1: z.number().default(0),
  x1: z.number().default(0),
  y1: z.number().default(0),
  mass2: z.number().default(0),
  x2: z.number().default(0),
  y2: z.number().default(0),
});

function evaluateAllFormulas(input: Center_of_gravity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mass1 * input.x1 + input.mass2 * input.x2) / (input.mass1 + input.mass2); results["x_cg"] = Number.isFinite(v) ? v : 0; } catch { results["x_cg"] = 0; }
  try { const v = (input.mass1 * input.y1 + input.mass2 * input.y2) / (input.mass1 + input.mass2); results["y_cg"] = Number.isFinite(v) ? v : 0; } catch { results["y_cg"] = 0; }
  return results;
}


export function calculateCenter_of_gravity_calculator(input: Center_of_gravity_calculatorInput): Center_of_gravity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["x_cg"] ?? 0;
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


export interface Center_of_gravity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
