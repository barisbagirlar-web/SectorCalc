// Auto-generated from knots-to-kmh-calculator-schema.json
import * as z from 'zod';

export interface Knots_to_kmh_calculatorInput {
  knots: number;
  conversionFactor: number;
  decimalPlaces: number;
  roundingMode: number;
}

export const Knots_to_kmh_calculatorInputSchema = z.object({
  knots: z.number().default(0),
  conversionFactor: z.number().default(1.852),
  decimalPlaces: z.number().default(2),
  roundingMode: z.number().default(1),
});

function evaluateAllFormulas(input: Knots_to_kmh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.knots * input.conversionFactor; results["rawKmh"] = Number.isFinite(v) ? v : 0; } catch { results["rawKmh"] = 0; }
  try { const v = (function() { const r = knots * conversionFactor; const f = Math.pow(10, decimalPlaces); return roundingMode === 0 ? Math.floor(r * f) / f : roundingMode === 2 ? Math.ceil(r * f) / f : Math.round(r * f) / f; })(); results["roundedKmh"] = Number.isFinite(v) ? v : 0; } catch { results["roundedKmh"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.decimalPlaces; results["decimalPlaces"] = Number.isFinite(v) ? v : 0; } catch { results["decimalPlaces"] = 0; }
  try { const v = input.roundingMode; results["roundingMode"] = Number.isFinite(v) ? v : 0; } catch { results["roundingMode"] = 0; }
  return results;
}


export function calculateKnots_to_kmh_calculator(input: Knots_to_kmh_calculatorInput): Knots_to_kmh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedKmh"] ?? 0;
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


export interface Knots_to_kmh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
