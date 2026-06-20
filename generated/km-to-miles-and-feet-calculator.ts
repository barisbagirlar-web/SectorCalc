// Auto-generated from km-to-miles-and-feet-calculator-schema.json
import * as z from 'zod';

export interface Km_to_miles_and_feet_calculatorInput {
  km_value: number;
  miles_factor: number;
  feet_per_mile: number;
  decimal_places: number;
  dataConfidence?: number;
}

export const Km_to_miles_and_feet_calculatorInputSchema = z.object({
  km_value: z.number().default(1),
  miles_factor: z.number().default(0.621371),
  feet_per_mile: z.number().default(5280),
  decimal_places: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Km_to_miles_and_feet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.km_value * input.miles_factor; results["miles"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["miles"] = Number.NaN; }
  try { const v = input.km_value * input.miles_factor * input.feet_per_mile; results["feet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feet"] = Number.NaN; }
  return results;
}


export function calculateKm_to_miles_and_feet_calculator(input: Km_to_miles_and_feet_calculatorInput): Km_to_miles_and_feet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["feet"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
