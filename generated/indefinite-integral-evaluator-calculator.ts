// Auto-generated from indefinite-integral-evaluator-calculator-schema.json
import * as z from 'zod';

export interface Indefinite_integral_evaluator_calculatorInput {
  a5: number;
  a4: number;
  a3: number;
  a2: number;
  a1: number;
  a0: number;
  x: number;
  C: number;
}

export const Indefinite_integral_evaluator_calculatorInputSchema = z.object({
  a5: z.number().default(0),
  a4: z.number().default(0),
  a3: z.number().default(0),
  a2: z.number().default(0),
  a1: z.number().default(0),
  a0: z.number().default(0),
  x: z.number().default(0),
  C: z.number().default(0),
});

function evaluateAllFormulas(input: Indefinite_integral_evaluator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a5 / 6 * Math.pow(input.x, 6); results["term6"] = Number.isFinite(v) ? v : 0; } catch { results["term6"] = 0; }
  try { const v = input.a4 / 5 * Math.pow(input.x, 5); results["term5"] = Number.isFinite(v) ? v : 0; } catch { results["term5"] = 0; }
  try { const v = input.a3 / 4 * Math.pow(input.x, 4); results["term4"] = Number.isFinite(v) ? v : 0; } catch { results["term4"] = 0; }
  try { const v = input.a2 / 3 * Math.pow(input.x, 3); results["term3"] = Number.isFinite(v) ? v : 0; } catch { results["term3"] = 0; }
  try { const v = input.a1 / 2 * Math.pow(input.x, 2); results["term2"] = Number.isFinite(v) ? v : 0; } catch { results["term2"] = 0; }
  try { const v = input.a0 * input.x; results["term1"] = Number.isFinite(v) ? v : 0; } catch { results["term1"] = 0; }
  try { const v = input.C; results["termC"] = Number.isFinite(v) ? v : 0; } catch { results["termC"] = 0; }
  try { const v = (results["term6"] ?? 0) + (results["term5"] ?? 0) + (results["term4"] ?? 0) + (results["term3"] ?? 0) + (results["term2"] ?? 0) + (results["term1"] ?? 0) + (results["termC"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateIndefinite_integral_evaluator_calculator(input: Indefinite_integral_evaluator_calculatorInput): Indefinite_integral_evaluator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Indefinite_integral_evaluator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
