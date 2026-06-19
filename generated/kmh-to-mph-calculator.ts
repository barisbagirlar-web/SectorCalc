// Auto-generated from kmh-to-mph-calculator-schema.json
import * as z from 'zod';

export interface Kmh_to_mph_calculatorInput {
  speed_kmh: number;
  conversion_factor: number;
  decimal_places: number;
  known_mph: number;
  dataConfidence?: number;
}

export const Kmh_to_mph_calculatorInputSchema = z.object({
  speed_kmh: z.number().default(0),
  conversion_factor: z.number().default(1.609344),
  decimal_places: z.number().default(2),
  known_mph: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kmh_to_mph_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed_kmh / input.conversion_factor; results["raw_mph"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["raw_mph"] = 0; }
  try { const v = input.speed_kmh / input.conversion_factor; results["raw_mph_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["raw_mph_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKmh_to_mph_calculator(input: Kmh_to_mph_calculatorInput): Kmh_to_mph_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["raw_mph_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Kmh_to_mph_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
