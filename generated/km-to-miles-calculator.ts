// Auto-generated from km-to-miles-calculator-schema.json
import * as z from 'zod';

export interface Km_to_miles_calculatorInput {
  kilometers: number;
  conversionFactor: number;
  roundingDecimals: number;
  scientificNotation: number;
}

export const Km_to_miles_calculatorInputSchema = z.object({
  kilometers: z.number().default(0),
  conversionFactor: z.number().default(0.621371),
  roundingDecimals: z.number().default(2),
  scientificNotation: z.number().default(0),
});

function evaluateAllFormulas(input: Km_to_miles_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.scientificNotation === 1) ? (Math.round(input.kilometers * input.conversionFactor * Math.pow(10, input.roundingDecimals)) / Math.pow(10, input.roundingDecimals)).toExponential(input.roundingDecimals) : Math.round(input.kilometers * input.conversionFactor * Math.pow(10, input.roundingDecimals)) / Math.pow(10, input.roundingDecimals); results["roundedMiles"] = Number.isFinite(v) ? v : 0; } catch { results["roundedMiles"] = 0; }
  results["breakdownSteps"] = 0;
  return results;
}


export function calculateKm_to_miles_calculator(input: Km_to_miles_calculatorInput): Km_to_miles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedMiles"] ?? 0;
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


export interface Km_to_miles_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
