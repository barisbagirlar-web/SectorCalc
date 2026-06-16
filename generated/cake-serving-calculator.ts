// Auto-generated from cake-serving-calculator-schema.json
import * as z from 'zod';

export interface Cake_serving_calculatorInput {
  shape: number;
  dim1: number;
  dim2: number;
  servingArea: number;
}

export const Cake_serving_calculatorInputSchema = z.object({
  shape: z.number().default(0),
  dim1: z.number().default(20),
  dim2: z.number().default(0),
  servingArea: z.number().default(25),
});

function evaluateAllFormulas(input: Cake_serving_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shape === 0 ? Math.PI * (input.dim1/2) ** 2 : input.dim1 * input.dim2; results["cakeArea"] = Number.isFinite(v) ? v : 0; } catch { results["cakeArea"] = 0; }
  try { const v = (results["cakeArea"] ?? 0) / input.servingArea; results["totalServings"] = Number.isFinite(v) ? v : 0; } catch { results["totalServings"] = 0; }
  return results;
}


export function calculateCake_serving_calculator(input: Cake_serving_calculatorInput): Cake_serving_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalServings"] ?? 0;
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


export interface Cake_serving_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
