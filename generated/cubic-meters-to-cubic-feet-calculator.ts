// Auto-generated from cubic-meters-to-cubic-feet-calculator-schema.json
import * as z from 'zod';

export interface Cubic_meters_to_cubic_feet_calculatorInput {
  cubicMeters: number;
  conversionFactor: number;
  decimalPlaces: number;
  safetyFactor: number;
  measurementUncertainty: number;
}

export const Cubic_meters_to_cubic_feet_calculatorInputSchema = z.object({
  cubicMeters: z.number().default(1),
  conversionFactor: z.number().default(35.314667),
  decimalPlaces: z.number().default(2),
  safetyFactor: z.number().default(1),
  measurementUncertainty: z.number().default(0),
});

function evaluateAllFormulas(input: Cubic_meters_to_cubic_feet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cubicMeters * input.conversionFactor * input.safetyFactor; results["cubicFeet"] = Number.isFinite(v) ? v : 0; } catch { results["cubicFeet"] = 0; }
  try { const v = (results["cubicFeet"] ?? 0) * (input.measurementUncertainty / 100); results["uncertainty"] = Number.isFinite(v) ? v : 0; } catch { results["uncertainty"] = 0; }
  try { const v = (results["cubicFeet"] ?? 0) - (results["uncertainty"] ?? 0); results["lowerBound"] = Number.isFinite(v) ? v : 0; } catch { results["lowerBound"] = 0; }
  try { const v = (results["cubicFeet"] ?? 0) + (results["uncertainty"] ?? 0); results["upperBound"] = Number.isFinite(v) ? v : 0; } catch { results["upperBound"] = 0; }
  try { const v = Math.round((results["cubicFeet"] ?? 0) * 10**input.decimalPlaces) / 10**input.decimalPlaces; results["cubicFeetRounded"] = Number.isFinite(v) ? v : 0; } catch { results["cubicFeetRounded"] = 0; }
  return results;
}


export function calculateCubic_meters_to_cubic_feet_calculator(input: Cubic_meters_to_cubic_feet_calculatorInput): Cubic_meters_to_cubic_feet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cubicFeetRounded"] ?? 0;
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


export interface Cubic_meters_to_cubic_feet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
