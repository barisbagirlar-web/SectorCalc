// Auto-generated from manova-calculator-schema.json
import * as z from 'zod';

export interface Manova_calculatorInput {
  n1: number;
  n2: number;
  d1: number;
  d2: number;
  v1: number;
  v2: number;
}

export const Manova_calculatorInputSchema = z.object({
  n1: z.number().default(30),
  n2: z.number().default(30),
  d1: z.number().default(0.5),
  d2: z.number().default(0.3),
  v1: z.number().default(1),
  v2: z.number().default(1),
});

function evaluateAllFormulas(input: Manova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n1 * input.n2 / (input.n1 + input.n2)) * ( (input.d1 * input.d1) / input.v1 + (input.d2 * input.d2) / input.v2 ); results["T2"] = Number.isFinite(v) ? v : 0; } catch { results["T2"] = 0; }
  try { const v = (results["T2"] ?? 0) * (input.n1 + input.n2 - 3) / (2 * (input.n1 + input.n2 - 2)); results["F_stat"] = Number.isFinite(v) ? v : 0; } catch { results["F_stat"] = 0; }
  try { const v = 2; results["df1"] = Number.isFinite(v) ? v : 0; } catch { results["df1"] = 0; }
  try { const v = input.n1 + input.n2 - 3; results["df2"] = Number.isFinite(v) ? v : 0; } catch { results["df2"] = 0; }
  return results;
}


export function calculateManova_calculator(input: Manova_calculatorInput): Manova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["T2"] ?? 0;
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


export interface Manova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
