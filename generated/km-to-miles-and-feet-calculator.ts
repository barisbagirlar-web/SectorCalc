// Auto-generated from km-to-miles-and-feet-calculator-schema.json
import * as z from 'zod';

export interface Km_to_miles_and_feet_calculatorInput {
  km_value: number;
  miles_factor: number;
  feet_per_mile: number;
  decimal_places: number;
}

export const Km_to_miles_and_feet_calculatorInputSchema = z.object({
  km_value: z.number().default(1),
  miles_factor: z.number().default(0.621371),
  feet_per_mile: z.number().default(5280),
  decimal_places: z.number().default(2),
});

function evaluateAllFormulas(input: Km_to_miles_and_feet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.km_value * input.miles_factor; results["miles"] = Number.isFinite(v) ? v : 0; } catch { results["miles"] = 0; }
  try { const v = input.km_value * input.miles_factor * input.feet_per_mile; results["feet"] = Number.isFinite(v) ? v : 0; } catch { results["feet"] = 0; }
  try { const v = Math.round((results["miles"] ?? 0) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places); results["miles_rounded"] = Number.isFinite(v) ? v : 0; } catch { results["miles_rounded"] = 0; }
  try { const v = Math.round((results["feet"] ?? 0) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places); results["feet_rounded"] = Number.isFinite(v) ? v : 0; } catch { results["feet_rounded"] = 0; }
  try { const v = (results["miles_rounded"] ?? 0) + ' mi, ' + (results["feet_rounded"] ?? 0) + ' ft'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateKm_to_miles_and_feet_calculator(input: Km_to_miles_and_feet_calculatorInput): Km_to_miles_and_feet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Km_to_miles_and_feet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
