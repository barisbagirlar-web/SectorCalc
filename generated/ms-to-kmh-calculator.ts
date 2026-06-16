// Auto-generated from ms-to-kmh-calculator-schema.json
import * as z from 'zod';

export interface Ms_to_kmh_calculatorInput {
  speedMs: number;
  conversionFactor: number;
  decimalPlaces: number;
  roundingMethod: number;
  expectedOutput: number;
}

export const Ms_to_kmh_calculatorInputSchema = z.object({
  speedMs: z.number().default(1),
  conversionFactor: z.number().default(3.6),
  decimalPlaces: z.number().default(2),
  roundingMethod: z.number().default(0),
  expectedOutput: z.number().default(0),
});

function evaluateAllFormulas(input: Ms_to_kmh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speedMs * input.conversionFactor; results["rawValue"] = Number.isFinite(v) ? v : 0; } catch { results["rawValue"] = 0; }
  try { const v = (input.roundingMethod === 0 ? Math.round(input.speedMs * input.conversionFactor * Math.pow(10, input.decimalPlaces)) : input.roundingMethod === 1 ? Math.floor(input.speedMs * input.conversionFactor * Math.pow(10, input.decimalPlaces)) : input.roundingMethod === 2 ? Math.ceil(input.speedMs * input.conversionFactor * Math.pow(10, input.decimalPlaces)) : input.speedMs * input.conversionFactor) / Math.pow(10, input.decimalPlaces); results["kmh"] = Number.isFinite(v) ? v : 0; } catch { results["kmh"] = 0; }
  return results;
}


export function calculateMs_to_kmh_calculator(input: Ms_to_kmh_calculatorInput): Ms_to_kmh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["{{kmh}} km/h"] ?? 0;
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


export interface Ms_to_kmh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
