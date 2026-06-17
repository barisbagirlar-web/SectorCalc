// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: L_100km_to_mpg_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.gallon_type == 1 ? 235.214583 : 282.480936; results["conversion_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversion_factor"] = 0; }
  try { const v = input.l_per_100km > 0 ? (asFormulaNumber(results["conversion_factor"])) / input.l_per_100km : 0; results["base_mpg"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_mpg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateL_100km_to_mpg_calculator(input: L_100km_to_mpg_calculatorInput): L_100km_to_mpg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["base_mpg"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
