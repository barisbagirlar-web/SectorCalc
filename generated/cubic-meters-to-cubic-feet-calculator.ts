// Auto-generated from cubic-meters-to-cubic-feet-calculator-schema.json
import * as z from 'zod';

export interface Cubic_meters_to_cubic_feet_calculatorInput {
  cubicMeters: number;
  conversionFactor: number;
  decimalPlaces: number;
  safetyFactor: number;
  measurementUncertainty: number;
  dataConfidence?: number;
}

export const Cubic_meters_to_cubic_feet_calculatorInputSchema = z.object({
  cubicMeters: z.number().default(1),
  conversionFactor: z.number().default(35.314667),
  decimalPlaces: z.number().default(2),
  safetyFactor: z.number().default(1),
  measurementUncertainty: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cubic_meters_to_cubic_feet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cubicMeters * input.conversionFactor * input.safetyFactor; results["cubicFeet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cubicFeet"] = 0; }
  try { const v = (asFormulaNumber(results["cubicFeet"])) * (input.measurementUncertainty / 100); results["uncertainty"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["uncertainty"] = 0; }
  try { const v = (asFormulaNumber(results["cubicFeet"])) - (asFormulaNumber(results["uncertainty"])); results["lowerBound"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lowerBound"] = 0; }
  try { const v = (asFormulaNumber(results["cubicFeet"])) + (asFormulaNumber(results["uncertainty"])); results["upperBound"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["upperBound"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCubic_meters_to_cubic_feet_calculator(input: Cubic_meters_to_cubic_feet_calculatorInput): Cubic_meters_to_cubic_feet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["upperBound"]);
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


export interface Cubic_meters_to_cubic_feet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
