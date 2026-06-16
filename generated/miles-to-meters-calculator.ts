// Auto-generated from miles-to-meters-calculator-schema.json
import * as z from 'zod';

export interface Miles_to_meters_calculatorInput {
  miles: number;
  conversion_factor: number;
  precision: number;
  rounding_mode: number;
}

export const Miles_to_meters_calculatorInputSchema = z.object({
  miles: z.number().default(1),
  conversion_factor: z.number().default(1609.344),
  precision: z.number().default(2),
  rounding_mode: z.number().default(0),
});

function evaluateAllFormulas(input: Miles_to_meters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.miles * input.conversion_factor; results["raw_meters"] = Number.isFinite(v) ? v : 0; } catch { results["raw_meters"] = 0; }
  try { const v = input.rounding_mode === 0 ? Math.round((results["raw_meters"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision) : input.rounding_mode === 1 ? Math.floor((results["raw_meters"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision) : Math.ceil((results["raw_meters"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["rounded_meters"] = Number.isFinite(v) ? v : 0; } catch { results["rounded_meters"] = 0; }
  return results;
}


export function calculateMiles_to_meters_calculator(input: Miles_to_meters_calculatorInput): Miles_to_meters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rounded_meters"] ?? 0;
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


export interface Miles_to_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
