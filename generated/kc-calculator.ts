// Auto-generated from kc-calculator-schema.json
import * as z from 'zod';

export interface Kc_calculatorInput {
  d10: number;
  d30: number;
  d60: number;
}

export const Kc_calculatorInputSchema = z.object({
  d10: z.number().default(0.1),
  d30: z.number().default(0.5),
  d60: z.number().default(1),
});

function evaluateAllFormulas(input: Kc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.d30 ** 2) / (input.d10 * input.d60); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.d30 ** 2; results["numerator"] = Number.isFinite(v) ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = input.d10 * input.d60; results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  return results;
}


export function calculateKc_calculator(input: Kc_calculatorInput): Kc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Kc"] ?? 0;
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


export interface Kc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
