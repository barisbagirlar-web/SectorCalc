// Auto-generated from one-sided-limit-calculator-schema.json
import * as z from 'zod';

export interface One_sided_limit_calculatorInput {
  mean: number;
  sd: number;
  n: number;
  zp: number;
  zgamma: number;
  direction: number;
}

export const One_sided_limit_calculatorInputSchema = z.object({
  mean: z.number().default(0),
  sd: z.number().default(1),
  n: z.number().default(30),
  zp: z.number().default(2.326),
  zgamma: z.number().default(1.645),
  direction: z.number().default(1),
});

function evaluateAllFormulas(input: One_sided_limit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.zp + (input.zp ** 2 - 1) * input.zgamma / (2 * Math.sqrt(input.n)); results["k"] = Number.isFinite(v) ? v : 0; } catch { results["k"] = 0; }
  try { const v = input.direction * (input.mean + (results["k"] ?? 0) * input.sd) + (1 - input.direction) * (input.mean - (results["k"] ?? 0) * input.sd); results["limit"] = Number.isFinite(v) ? v : 0; } catch { results["limit"] = 0; }
  return results;
}


export function calculateOne_sided_limit_calculator(input: One_sided_limit_calculatorInput): One_sided_limit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["limit"] ?? 0;
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


export interface One_sided_limit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
