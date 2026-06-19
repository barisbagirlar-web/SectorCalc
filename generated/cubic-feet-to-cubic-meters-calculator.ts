// Auto-generated from cubic-feet-to-cubic-meters-calculator-schema.json
import * as z from 'zod';

export interface Cubic_feet_to_cubic_meters_calculatorInput {
  lengthFeet: number;
  widthFeet: number;
  heightFeet: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Cubic_feet_to_cubic_meters_calculatorInputSchema = z.object({
  lengthFeet: z.number().default(1),
  widthFeet: z.number().default(1),
  heightFeet: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cubic_feet_to_cubic_meters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lengthFeet * input.widthFeet * input.heightFeet; results["volumeCubicFeet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeCubicFeet"] = 0; }
  try { const v = (asFormulaNumber(results["volumeCubicFeet"])) * 0.028316846592; results["rawCubicMeters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawCubicMeters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCubic_feet_to_cubic_meters_calculator(input: Cubic_feet_to_cubic_meters_calculatorInput): Cubic_feet_to_cubic_meters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rawCubicMeters"]));
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


export interface Cubic_feet_to_cubic_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
