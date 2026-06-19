// Auto-generated from toll-calculator-schema.json
import * as z from 'zod';

export interface Toll_calculatorInput {
  distance_km: number;
  base_toll_rate: number;
  axle_multiplier: number;
  fixed_toll_fee: number;
  weight_factor: number;
  vat_rate: number;
  dataConfidence?: number;
}

export const Toll_calculatorInputSchema = z.object({
  distance_km: z.number().default(500),
  base_toll_rate: z.number().default(0.25),
  axle_multiplier: z.number().default(1),
  fixed_toll_fee: z.number().default(0),
  weight_factor: z.number().default(1),
  vat_rate: z.number().default(18),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Toll_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance_km * input.base_toll_rate * (input.axle_multiplier + input.weight_factor) + input.fixed_toll_fee; results["total_toll_excl_vat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_toll_excl_vat"] = 0; }
  try { const v = (asFormulaNumber(results["total_toll_excl_vat"])) * input.vat_rate / 100; results["vat_amount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vat_amount"] = 0; }
  try { const v = (asFormulaNumber(results["total_toll_excl_vat"])) + (asFormulaNumber(results["vat_amount"])); results["total_toll_incl_vat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_toll_incl_vat"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateToll_calculator(input: Toll_calculatorInput): Toll_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_toll_incl_vat"]));
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


export interface Toll_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
