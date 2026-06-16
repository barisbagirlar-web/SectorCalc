// Auto-generated from mpg-to-kml-calculator-schema.json
import * as z from 'zod';

export interface Mpg_to_kml_calculatorInput {
  mpg: number;
  conversionFactor: number;
  decimalPlaces: number;
  measurementUncertainty: number;
  calibrationOffset: number;
}

export const Mpg_to_kml_calculatorInputSchema = z.object({
  mpg: z.number().default(30),
  conversionFactor: z.number().default(0.425144),
  decimalPlaces: z.number().default(2),
  measurementUncertainty: z.number().default(0),
  calibrationOffset: z.number().default(0),
});

function evaluateAllFormulas(input: Mpg_to_kml_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mpg * input.conversionFactor + input.calibrationOffset; results["rawValue"] = Number.isFinite(v) ? v : 0; } catch { results["rawValue"] = 0; }
  try { const v = Math.round((results["rawValue"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["roundedValue"] = Number.isFinite(v) ? v : 0; } catch { results["roundedValue"] = 0; }
  try { const v = (results["roundedValue"] ?? 0) * (1 - input.measurementUncertainty / 100); results["minTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["minTolerance"] = 0; }
  try { const v = (results["roundedValue"] ?? 0) * (1 + input.measurementUncertainty / 100); results["maxTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["maxTolerance"] = 0; }
  return results;
}


export function calculateMpg_to_kml_calculator(input: Mpg_to_kml_calculatorInput): Mpg_to_kml_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedValue"] ?? 0;
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


export interface Mpg_to_kml_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
