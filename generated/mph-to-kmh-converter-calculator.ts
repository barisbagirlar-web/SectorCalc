// Auto-generated from mph-to-kmh-converter-calculator-schema.json
import * as z from 'zod';

export interface Mph_to_kmh_converter_calculatorInput {
  mphValue: number;
  precision: number;
  outputUnit: number;
  roundingMode: number;
}

export const Mph_to_kmh_converter_calculatorInputSchema = z.object({
  mphValue: z.number().default(60),
  precision: z.number().default(2),
  outputUnit: z.number().default(0),
  roundingMode: z.number().default(0),
});

function evaluateAllFormulas(input: Mph_to_kmh_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mphValue * (input.outputUnit === 0 ? 1.609344 : input.outputUnit === 1 ? 0.44704 : 0.868976); results["rawValue"] = Number.isFinite(v) ? v : 0; } catch { results["rawValue"] = 0; }
  try { const v = input.outputUnit === 0 ? 1.609344 : input.outputUnit === 1 ? 0.44704 : 0.868976; results["conversionFactorUsed"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactorUsed"] = 0; }
  try { const v = (input.roundingMode === 0 ? Math.round : input.roundingMode === 1 ? Math.floor : Math.ceil)((results["rawValue"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["convertedSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["convertedSpeed"] = 0; }
  try { const v = (results["convertedSpeed"] ?? 0) + ' ' + (input.outputUnit === 0 ? 'km/h' : input.outputUnit === 1 ? 'm/s' : 'knots'); results["formattedResult"] = Number.isFinite(v) ? v : 0; } catch { results["formattedResult"] = 0; }
  return results;
}


export function calculateMph_to_kmh_converter_calculator(input: Mph_to_kmh_converter_calculatorInput): Mph_to_kmh_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertedSpeed"] ?? 0;
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


export interface Mph_to_kmh_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
