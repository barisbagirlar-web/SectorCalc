// Auto-generated from effect-size-calculator-schema.json
import * as z from 'zod';

export interface Effect_size_calculatorInput {
  mean1: number;
  mean2: number;
  sd1: number;
  sd2: number;
  n1: number;
  n2: number;
}

export const Effect_size_calculatorInputSchema = z.object({
  mean1: z.number().default(0),
  mean2: z.number().default(0),
  sd1: z.number().default(1),
  sd2: z.number().default(1),
  n1: z.number().default(30),
  n2: z.number().default(30),
});

function evaluateAllFormulas(input: Effect_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(((input.n1-1)*Math.pow(input.sd1,2) + (input.n2-1)*Math.pow(input.sd2,2))/(input.n1+input.n2-2)); results["pooledSd"] = Number.isFinite(v) ? v : 0; } catch { results["pooledSd"] = 0; }
  try { const v = input.mean1 - input.mean2; results["meanDiff"] = Number.isFinite(v) ? v : 0; } catch { results["meanDiff"] = 0; }
  try { const v = (input.mean1 - input.mean2) / (results["pooledSd"] ?? 0); results["d"] = Number.isFinite(v) ? v : 0; } catch { results["d"] = 0; }
  return results;
}


export function calculateEffect_size_calculator(input: Effect_size_calculatorInput): Effect_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["d"] ?? 0;
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


export interface Effect_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
