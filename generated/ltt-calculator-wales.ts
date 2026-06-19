// Auto-generated from ltt-calculator-wales-schema.json
import * as z from 'zod';

export interface Ltt_calculator_walesInput {
  distance_km: number;
  fuel_consumption_l_per_100km: number;
  fuel_price_gbp_per_l: number;
  driver_wage_gbp_per_hour: number;
  average_speed_kmh: number;
  load_tonnes: number;
  co2_emission_factor_kg_per_l: number;
  dataConfidence?: number;
}

export const Ltt_calculator_walesInputSchema = z.object({
  distance_km: z.number().default(100),
  fuel_consumption_l_per_100km: z.number().default(30),
  fuel_price_gbp_per_l: z.number().default(1.5),
  driver_wage_gbp_per_hour: z.number().default(15),
  average_speed_kmh: z.number().default(60),
  load_tonnes: z.number().default(20),
  co2_emission_factor_kg_per_l: z.number().default(2.68),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ltt_calculator_walesInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance_km * (input.fuel_consumption_l_per_100km / 100) * input.fuel_price_gbp_per_l; results["total_fuel_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_fuel_cost"] = 0; }
  try { const v = input.distance_km / input.average_speed_kmh; results["travel_time_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["travel_time_hours"] = 0; }
  try { const v = (asFormulaNumber(results["travel_time_hours"])) * input.driver_wage_gbp_per_hour; results["driver_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["driver_cost"] = 0; }
  try { const v = (asFormulaNumber(results["total_fuel_cost"])) + (asFormulaNumber(results["driver_cost"])); results["total_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (asFormulaNumber(results["total_cost"])) / (input.distance_km * input.load_tonnes); results["cost_per_tonne_km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cost_per_tonne_km"] = 0; }
  try { const v = input.distance_km * (input.fuel_consumption_l_per_100km / 100) * input.co2_emission_factor_kg_per_l; results["total_co2_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_co2_kg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLtt_calculator_wales(input: Ltt_calculator_walesInput): Ltt_calculator_walesOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_cost"]));
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


export interface Ltt_calculator_walesOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
