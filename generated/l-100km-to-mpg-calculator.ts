// Auto-generated from l-100km-to-mpg-calculator-schema.json
import * as z from 'zod';

export interface L_100km_to_mpg_calculatorInput {
  l_per_100km: number;
  gallon_type: number;
  decimal_places: number;
  rounding_method: number;
  measurement_standard: number;
  fuel_type: number;
  vehicle_class: number;
  route_type: number;
}

export const L_100km_to_mpg_calculatorInputSchema = z.object({
  l_per_100km: z.number().default(8),
  gallon_type: z.number().default(1),
  decimal_places: z.number().default(2),
  rounding_method: z.number().default(0),
  measurement_standard: z.number().default(1),
  fuel_type: z.number().default(1),
  vehicle_class: z.number().default(1),
  route_type: z.number().default(3),
});

function evaluateAllFormulas(input: L_100km_to_mpg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gallon_type == 1 ? 235.214583 : 282.480936; results["conversion_factor"] = Number.isFinite(v) ? v : 0; } catch { results["conversion_factor"] = 0; }
  try { const v = input.l_per_100km > 0 ? (results["conversion_factor"] ?? 0) / input.l_per_100km : 0; results["base_mpg"] = Number.isFinite(v) ? v : 0; } catch { results["base_mpg"] = 0; }
  try { const v = input.rounding_method == 0 ? Math.round((results["base_mpg"] ?? 0) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places) : input.rounding_method == 1 ? Math.floor((results["base_mpg"] ?? 0) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places) : Math.ceil((results["base_mpg"] ?? 0) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places); results["output_mpg"] = Number.isFinite(v) ? v : 0; } catch { results["output_mpg"] = 0; }
  return results;
}


export function calculateL_100km_to_mpg_calculator(input: L_100km_to_mpg_calculatorInput): L_100km_to_mpg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["output_mpg"] ?? 0;
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


export interface L_100km_to_mpg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
