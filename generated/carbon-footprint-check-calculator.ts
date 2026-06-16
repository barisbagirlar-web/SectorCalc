// Auto-generated from carbon-footprint-check-calculator-schema.json
import * as z from 'zod';

export interface Carbon_footprint_check_calculatorInput {
  energy_consumption: number;
  energy_source: string;
  fuel_consumption: number;
  waste_generated: number;
  recycling_rate: number;
  production_volume: number;
  transport_distance: number;
  has_carbon_offset_program: boolean;
}

export const Carbon_footprint_check_calculatorInputSchema = z.object({
  energy_consumption: z.number().min(0).max(10000000).default(100000),
  energy_source: z.enum(['grid_mix', 'solar', 'wind', 'natural_gas', 'coal']).default('grid_mix'),
  fuel_consumption: z.number().min(0).max(10000000).default(50000),
  waste_generated: z.number().min(0).max(100000).default(200),
  recycling_rate: z.number().min(0).max(100).default(30),
  production_volume: z.number().min(1).max(100000000).default(50000),
  transport_distance: z.number().min(0).max(50000).default(500),
  has_carbon_offset_program: z.boolean().default(false),
});

function evaluateAllFormulas(input: Carbon_footprint_check_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.energy_consumption * (input.energy_source === 'grid_mix' ? 0.5 : (input.energy_source === 'solar' ? 0.05 : (input.energy_source === 'wind' ? 0.02 : (input.energy_source === 'natural_gas' ? 0.4 : (input.energy_source === 'coal' ? 0.9 : 0.5))))); results["energy_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["energy_emissions"] = 0; }
  try { const v = input.fuel_consumption * 2.68; results["fuel_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["fuel_emissions"] = 0; }
  try { const v = input.waste_generated * (1 - input.recycling_rate / 100) * 0.6 * 1000; results["waste_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["waste_emissions"] = 0; }
  try { const v = input.production_volume * input.transport_distance * 0.1; results["transport_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["transport_emissions"] = 0; }
  try { const v = (results["energy_emissions"] ?? 0) + (results["fuel_emissions"] ?? 0) + (results["waste_emissions"] ?? 0) + (results["transport_emissions"] ?? 0); results["total_gross_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["total_gross_emissions"] = 0; }
  try { const v = input.has_carbon_offset_program ? (results["total_gross_emissions"] ?? 0) * 0.9 : (results["total_gross_emissions"] ?? 0); results["offset_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["offset_adjustment"] = 0; }
  try { const v = (results["offset_adjustment"] ?? 0) / 1000; results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateCarbon_footprint_check_calculator(input: Carbon_footprint_check_calculatorInput): Carbon_footprint_check_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["carbon_footprint_total"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    energy_emissions_tco2e: values["energy_emissions_tco2e"] ?? 0,
    fuel_emissions_tco2e: values["fuel_emissions_tco2e"] ?? 0,
    waste_emissions_tco2e: values["waste_emissions_tco2e"] ?? 0,
    transport_emissions_tco2e: values["transport_emissions_tco2e"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Energy Intensity per Unit","Waste to Landfill Ratio","Logistics Carbon per km"];
  const suggestedActions: string[] = ["Switch to renewable energy (solar/wind) to reduce energy emissions by up to 90%.","Implement a Lean waste segregation program to increase recycling rate above 50%.","Optimize transport routes and consolidate shipments to reduce distance by 15%.","Purchase verified carbon offsets for remaining unavoidable emissions."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Scenario simulation"],
  };
}


export interface Carbon_footprint_check_calculatorOutput {
  totalWasteCost: number;
  breakdown: { energy_emissions_tco2e: number; fuel_emissions_tco2e: number; waste_emissions_tco2e: number; transport_emissions_tco2e: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
