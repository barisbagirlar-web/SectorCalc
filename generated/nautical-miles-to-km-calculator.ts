// Auto-generated from nautical-miles-to-km-calculator-schema.json
import * as z from 'zod';

export interface Nautical_miles_to_km_calculatorInput {
  nauticalMiles: number;
  conversionFactor: number;
  numberOfTrips: number;
  precision: number;
}

export const Nautical_miles_to_km_calculatorInputSchema = z.object({
  nauticalMiles: z.number().default(0),
  conversionFactor: z.number().default(1.852),
  numberOfTrips: z.number().default(1),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Nautical_miles_to_km_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nauticalMiles * input.conversionFactor * input.numberOfTrips; results["rawKm"] = Number.isFinite(v) ? v : 0; } catch { results["rawKm"] = 0; }
  try { const v = Math.round((results["rawKm"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["km"] = Number.isFinite(v) ? v : 0; } catch { results["km"] = 0; }
  try { const v = input.nauticalMiles; results["nauticalMiles"] = Number.isFinite(v) ? v : 0; } catch { results["nauticalMiles"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  return results;
}


export function calculateNautical_miles_to_km_calculator(input: Nautical_miles_to_km_calculatorInput): Nautical_miles_to_km_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["km"] ?? 0;
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


export interface Nautical_miles_to_km_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
