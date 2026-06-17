// @ts-nocheck
// Auto-generated from flight-carbon-footprint-calculator-schema.json
import * as z from 'zod';

export interface Flight_carbon_footprint_calculatorInput {
  distance_km: number;
  fuel_burn_per_100_pkm: number;
  emission_factor_kg_per_liter: number;
  class_multiplier: number;
  radiative_forcing_index: number;
}

export const Flight_carbon_footprint_calculatorInputSchema = z.object({
  distance_km: z.number().default(1000),
  fuel_burn_per_100_pkm: z.number().default(3.5),
  emission_factor_kg_per_liter: z.number().default(2.52),
  class_multiplier: z.number().default(1),
  radiative_forcing_index: z.number().default(1.9),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flight_carbon_footprint_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance_km * input.fuel_burn_per_100_pkm / 100 * input.emission_factor_kg_per_liter * input.class_multiplier * input.radiative_forcing_index; results["total_kg_CO2e"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_kg_CO2e"] = 0; }
  try { const v = input.distance_km * input.fuel_burn_per_100_pkm / 100 * input.emission_factor_kg_per_liter * input.class_multiplier; results["base_kg_CO2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_kg_CO2"] = 0; }
  try { const v = (asFormulaNumber(results["total_kg_CO2e"])) - (asFormulaNumber(results["base_kg_CO2"])); results["radiative_forcing_contribution_kg_CO2e"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["radiative_forcing_contribution_kg_CO2e"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFlight_carbon_footprint_calculator(input: Flight_carbon_footprint_calculatorInput): Flight_carbon_footprint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_kg_CO2e"]);
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


export interface Flight_carbon_footprint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
