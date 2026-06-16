// Auto-generated from fahrenheit-to-kelvin-calculator-schema.json
import * as z from 'zod';

export interface Fahrenheit_to_kelvin_calculatorInput {
  fahrenheit: number;
  subtractOffset: number;
  multiplyFactor: number;
  addOffset: number;
  precision: number;
}

export const Fahrenheit_to_kelvin_calculatorInputSchema = z.object({
  fahrenheit: z.number().default(32),
  subtractOffset: z.number().default(32),
  multiplyFactor: z.number().default(0.5555555555555556),
  addOffset: z.number().default(273.15),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Fahrenheit_to_kelvin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fahrenheit - input.subtractOffset; results["celsiusDifference"] = Number.isFinite(v) ? v : 0; } catch { results["celsiusDifference"] = 0; }
  try { const v = (results["celsiusDifference"] ?? 0) * input.multiplyFactor; results["kelvinDifference"] = Number.isFinite(v) ? v : 0; } catch { results["kelvinDifference"] = 0; }
  try { const v = (results["kelvinDifference"] ?? 0) + input.addOffset; results["kelvin"] = Number.isFinite(v) ? v : 0; } catch { results["kelvin"] = 0; }
  try { const v = Math.round((results["kelvin"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedKelvin"] = Number.isFinite(v) ? v : 0; } catch { results["roundedKelvin"] = 0; }
  return results;
}


export function calculateFahrenheit_to_kelvin_calculator(input: Fahrenheit_to_kelvin_calculatorInput): Fahrenheit_to_kelvin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedKelvin"] ?? 0;
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


export interface Fahrenheit_to_kelvin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
