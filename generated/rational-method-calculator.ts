// Auto-generated from rational-method-calculator-schema.json
import * as z from 'zod';

export interface Rational_method_calculatorInput {
  c: number;
  i: number;
  a: number;
  sf: number;
}

export const Rational_method_calculatorInputSchema = z.object({
  c: z.number().default(0.5),
  i: z.number().default(50),
  a: z.number().default(1),
  sf: z.number().default(1),
});

function evaluateAllFormulas(input: Rational_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sf * input.c * input.i * input.a / 0.36; results["peakDischargeLps"] = Number.isFinite(v) ? v : 0; } catch { results["peakDischargeLps"] = 0; }
  try { const v = input.sf * input.c * input.i * input.a / 360; results["peakDischargeCumecs"] = Number.isFinite(v) ? v : 0; } catch { results["peakDischargeCumecs"] = 0; }
  return results;
}


export function calculateRational_method_calculator(input: Rational_method_calculatorInput): Rational_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["peakDischargeLps"] ?? 0;
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


export interface Rational_method_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
