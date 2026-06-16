// Auto-generated from cubic-feet-to-cubic-meters-calculator-schema.json
import * as z from 'zod';

export interface Cubic_feet_to_cubic_meters_calculatorInput {
  lengthFeet: number;
  widthFeet: number;
  heightFeet: number;
  decimalPlaces: number;
}

export const Cubic_feet_to_cubic_meters_calculatorInputSchema = z.object({
  lengthFeet: z.number().default(1),
  widthFeet: z.number().default(1),
  heightFeet: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Cubic_feet_to_cubic_meters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lengthFeet * input.widthFeet * input.heightFeet; results["volumeCubicFeet"] = Number.isFinite(v) ? v : 0; } catch { results["volumeCubicFeet"] = 0; }
  try { const v = (results["volumeCubicFeet"] ?? 0) * 0.028316846592; results["rawCubicMeters"] = Number.isFinite(v) ? v : 0; } catch { results["rawCubicMeters"] = 0; }
  return results;
}


export function calculateCubic_feet_to_cubic_meters_calculator(input: Cubic_feet_to_cubic_meters_calculatorInput): Cubic_feet_to_cubic_meters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rawCubicMeters"] ?? 0;
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


export interface Cubic_feet_to_cubic_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
