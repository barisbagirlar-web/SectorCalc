// Auto-generated from cables-to-nautical-miles-calculator-schema.json
import * as z from 'zod';

export interface Cables_to_nautical_miles_calculatorInput {
  cables: number;
  conversionFactor: number;
  uncertainty: number;
  precision: number;
}

export const Cables_to_nautical_miles_calculatorInputSchema = z.object({
  cables: z.number().default(0),
  conversionFactor: z.number().default(0.1),
  uncertainty: z.number().default(0),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Cables_to_nautical_miles_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cables * input.conversionFactor; results["exactNM"] = Number.isFinite(v) ? v : 0; } catch { results["exactNM"] = 0; }
  try { const v = input.uncertainty * input.conversionFactor; results["uncertaintyNM"] = Number.isFinite(v) ? v : 0; } catch { results["uncertaintyNM"] = 0; }
  try { const v = Math.round((input.cables * input.conversionFactor) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedNM"] = Number.isFinite(v) ? v : 0; } catch { results["roundedNM"] = 0; }
  return results;
}


export function calculateCables_to_nautical_miles_calculator(input: Cables_to_nautical_miles_calculatorInput): Cables_to_nautical_miles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedNM"] ?? 0;
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


export interface Cables_to_nautical_miles_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
