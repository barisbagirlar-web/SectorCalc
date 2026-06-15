// Auto-generated from filament-recycling-cost-comparator-schema.json
import * as z from 'zod';

export interface Filament_recycling_cost_comparatorInput {
  recycling_machine_cost: number;
  machine_life_years: number;
  annual_maintenance_cost: number;
  electricity_price: number;
  recycling_energy_consumption: number;
  labor_rate: number;
  labor_hours_per_kg: number;
  waste_collection_cost: number;
  virgin_filament_price: number;
  recycling_yield: number;
  quality_factor: number;
  annual_production_volume: number;
  waste_type: string;
  include_carbon_cost: boolean;
  carbon_price: number;
}

export const Filament_recycling_cost_comparatorInputSchema = z.object({
  recycling_machine_cost: z.number().min(10000).max(500000).default(50000),
  machine_life_years: z.number().min(3).max(20).default(10),
  annual_maintenance_cost: z.number().min(1000).max(50000).default(5000),
  electricity_price: z.number().min(0.05).max(0.4).default(0.12),
  recycling_energy_consumption: z.number().min(0.5).max(10).default(2.5),
  labor_rate: z.number().min(10).max(80).default(25),
  labor_hours_per_kg: z.number().min(0.01).max(0.5).default(0.05),
  waste_collection_cost: z.number().min(0.05).max(2).default(0.3),
  virgin_filament_price: z.number().min(10).max(100).default(25),
  recycling_yield: z.number().min(50).max(100).default(85),
  quality_factor: z.number().min(60).max(100).default(90),
  annual_production_volume: z.number().min(1000).max(1000000).default(10000),
  waste_type: z.enum(['PLA', 'ABS', 'PETG', 'Mixed']).default('PLA'),
  include_carbon_cost: z.boolean().default(true),
  carbon_price: z.number().min(0).max(200).default(50),
});

function evaluateAllFormulas(input: Filament_recycling_cost_comparatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["annual_depreciation"] = input.recycling_machine_cost / input.machine_life_years; } catch { results["annual_depreciation"] = 0; }
  try { results["annual_energy_cost"] = input.annual_production_volume * input.recycling_energy_consumption * input.electricity_price; } catch { results["annual_energy_cost"] = 0; }
  try { results["annual_labor_cost"] = input.annual_production_volume * input.labor_hours_per_kg * input.labor_rate; } catch { results["annual_labor_cost"] = 0; }
  try { results["annual_waste_collection"] = input.annual_production_volume * input.waste_collection_cost / (input.recycling_yield / 100); } catch { results["annual_waste_collection"] = 0; }
  try { results["annual_carbon_cost"] = input.include_carbon_cost ? (input.annual_production_volume * 0.5 * input.carbon_price / 1000) : 0; } catch { results["annual_carbon_cost"] = 0; }
  try { results["total_annual_recycling_cost"] = (results["annual_depreciation"] ?? 0) + input.annual_maintenance_cost + (results["annual_energy_cost"] ?? 0) + (results["annual_labor_cost"] ?? 0) + (results["annual_waste_collection"] ?? 0) + (results["annual_carbon_cost"] ?? 0); } catch { results["total_annual_recycling_cost"] = 0; }
  try { results["cost_per_kg_recycled"] = (results["total_annual_recycling_cost"] ?? 0) / input.annual_production_volume; } catch { results["cost_per_kg_recycled"] = 0; }
  try { results["quality_adjusted_cost"] = (results["cost_per_kg_recycled"] ?? 0) / (input.quality_factor / 100); } catch { results["quality_adjusted_cost"] = 0; }
  try { results["savings_per_kg"] = input.virgin_filament_price - (results["quality_adjusted_cost"] ?? 0); } catch { results["savings_per_kg"] = 0; }
  return results;
}


export function calculateFilament_recycling_cost_comparator(input: Filament_recycling_cost_comparatorInput): Filament_recycling_cost_comparatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
  const breakdown = {
    depreciation_per_kg: values["depreciation_per_kg"] ?? 0,
    maintenance_per_kg: values["maintenance_per_kg"] ?? 0,
    energy_per_kg: values["energy_per_kg"] ?? 0,
    labor_per_kg: values["labor_per_kg"] ?? 0,
    waste_collection_per_kg: values["waste_collection_per_kg"] ?? 0,
    carbon_per_kg: values["carbon_per_kg"] ?? 0,
    quality_adjustment_factor: values["quality_adjustment_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Yield Loss Cost","Quality Degradation Cost","Energy Inefficiency Penalty"];
  const suggestedActions: string[] = ["Improve Recycling Yield","Reduce Energy Consumption","Increase Production Volume","Negotiate Waste Collection Rates"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Scenario simulation"],
  };
}


export interface Filament_recycling_cost_comparatorOutput {
  totalWasteCost: number;
  breakdown: { depreciation_per_kg: number; maintenance_per_kg: number; energy_per_kg: number; labor_per_kg: number; waste_collection_per_kg: number; carbon_per_kg: number; quality_adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
