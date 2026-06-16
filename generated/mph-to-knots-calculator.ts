// Auto-generated from mph-to-knots-calculator-schema.json
import * as z from 'zod';

export interface Mph_to_knots_calculatorInput {
  mph: number;
  conversionFactor: number;
  decimals: number;
  knownKnots: number;
  tolerance: number;
}

export const Mph_to_knots_calculatorInputSchema = z.object({
  mph: z.number().default(60),
  conversionFactor: z.number().default(0.868976),
  decimals: z.number().default(1),
  knownKnots: z.number().default(0),
  tolerance: z.number().default(0.01),
});

function evaluateAllFormulas(input: Mph_to_knots_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mph * input.conversionFactor; results["exactKnots"] = Number.isFinite(v) ? v : 0; } catch { results["exactKnots"] = 0; }
  try { const v = Math.round((results["exactKnots"] ?? 0) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["knots"] = Number.isFinite(v) ? v : 0; } catch { results["knots"] = 0; }
  try { const v = input.knownKnots > 0 ? Math.abs((results["knots"] ?? 0) - input.knownKnots) : null; results["deviation"] = Number.isFinite(v) ? v : 0; } catch { results["deviation"] = 0; }
  try { const v = input.knownKnots > 0 ? (results["deviation"] ?? 0) <= input.tolerance : true; results["withinTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["withinTolerance"] = 0; }
  return results;
}


export function calculateMph_to_knots_calculator(input: Mph_to_knots_calculatorInput): Mph_to_knots_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["knots"] ?? 0;
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


export interface Mph_to_knots_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
