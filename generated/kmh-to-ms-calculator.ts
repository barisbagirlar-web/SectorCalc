// Auto-generated from kmh-to-ms-calculator-schema.json
import * as z from 'zod';

export interface Kmh_to_ms_calculatorInput {
  speed_kmh: number;
  decimal_places: number;
  conversion_factor: number;
  measurement_uncertainty_percent: number;
}

export const Kmh_to_ms_calculatorInputSchema = z.object({
  speed_kmh: z.number().default(0),
  decimal_places: z.number().default(2),
  conversion_factor: z.number().default(3.6),
  measurement_uncertainty_percent: z.number().default(0.1),
});

function evaluateAllFormulas(input: Kmh_to_ms_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed_kmh / input.conversion_factor; results["speed_ms_raw"] = Number.isFinite(v) ? v : 0; } catch { results["speed_ms_raw"] = 0; }
  try { const v = Math.round((results["speed_ms_raw"] ?? 0) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places); results["speed_ms_rounded"] = Number.isFinite(v) ? v : 0; } catch { results["speed_ms_rounded"] = 0; }
  try { const v = (results["speed_ms_rounded"] ?? 0) * input.measurement_uncertainty_percent / 100; results["uncertainty"] = Number.isFinite(v) ? v : 0; } catch { results["uncertainty"] = 0; }
  try { const v = `Convert km/h to m/s: ${input.speed_kmh} km/h ÷ ${input.conversion_factor} = ${(results["speed_ms_raw"] ?? 0)} m/s`; results["breakdown_step1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_step1"] = 0; }
  try { const v = `Rounded to ${input.decimal_places} decimal places: ${(results["speed_ms_rounded"] ?? 0)} m/s`; results["breakdown_step2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_step2"] = 0; }
  try { const v = `Measurement (results["uncertainty"] ?? 0) (${input.measurement_uncertainty_percent}%): + ${(results["uncertainty"] ?? 0).toFixed(input.decimal_places)} m/s`; results["breakdown_step3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_step3"] = 0; }
  return results;
}


export function calculateKmh_to_ms_calculator(input: Kmh_to_ms_calculatorInput): Kmh_to_ms_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["speed_ms_rounded"] ?? 0;
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


export interface Kmh_to_ms_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
