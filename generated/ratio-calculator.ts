// Auto-generated from ratio-calculator-schema.json
import * as z from 'zod';

export interface Ratio_calculatorInput {
  numerator: number;
  denominator: number;
  multiplier: number;
  decimalPlaces: number;
}

export const Ratio_calculatorInputSchema = z.object({
  numerator: z.number().default(1),
  denominator: z.number().default(1),
  multiplier: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.denominator !== 0 ? input.numerator / input.denominator : null; results["rawRatio"] = Number.isFinite(v) ? v : 0; } catch { results["rawRatio"] = 0; }
  try { const v = input.denominator !== 0 ? (input.numerator / input.denominator * input.multiplier) : null; results["multipliedRatio"] = Number.isFinite(v) ? v : 0; } catch { results["multipliedRatio"] = 0; }
  try { const v = input.denominator !== 0 ? Math.round((input.numerator / input.denominator * input.multiplier) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : null; results["roundedRatio"] = Number.isFinite(v) ? v : 0; } catch { results["roundedRatio"] = 0; }
  return results;
}


export function calculateRatio_calculator(input: Ratio_calculatorInput): Ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedRatio"] ?? 0;
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


export interface Ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
