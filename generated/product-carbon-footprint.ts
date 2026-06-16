// Auto-generated from product-carbon-footprint-schema.json
import * as z from 'zod';

export interface Product_carbon_footprintInput {
  material_weight: number;
  material_type: string;
  energy_consumption: number;
  transport_distance: number;
  transport_mode: string;
  recycled_content: number;
  use_phase_efficiency: number;
  lifespan: number;
  end_of_life_recycling_rate: number;
  energy_source: string;
}

export const Product_carbon_footprintInputSchema = z.object({
  material_weight: z.number().min(0).max(100000).default(100),
  material_type: z.enum(['steel', 'aluminum', 'plastic', 'glass', 'wood', 'composite']).default('steel'),
  energy_consumption: z.number().min(0).max(1000000).default(500),
  transport_distance: z.number().min(0).max(50000).default(1000),
  transport_mode: z.enum(['truck', 'rail', 'ship', 'air']).default('truck'),
  recycled_content: z.number().min(0).max(100).default(20),
  use_phase_efficiency: z.number().min(0).max(10000).default(50),
  lifespan: z.number().min(1).max(50).default(10),
  end_of_life_recycling_rate: z.number().min(0).max(100).default(50),
  energy_source: z.enum(['grid', 'solar', 'wind', 'hydro', 'natural_gas', 'coal']).default('grid'),
});

function evaluateAllFormulas(input: Product_carbon_footprintInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.material_weight * (1 - input.recycled_content/100) * emission_factor_material; results["material_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["material_emissions"] = 0; }
  try { const v = input.energy_consumption * emission_factor_energy; results["manufacturing_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["manufacturing_emissions"] = 0; }
  try { const v = input.transport_distance * input.material_weight * emission_factor_transport; results["transport_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["transport_emissions"] = 0; }
  try { const v = input.use_phase_efficiency * input.lifespan * emission_factor_energy_grid; results["use_phase_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["use_phase_emissions"] = 0; }
  try { const v = input.material_weight * (1 - input.end_of_life_recycling_rate/100) * emission_factor_disposal - input.material_weight * (input.end_of_life_recycling_rate/100) * emission_factor_recycling_credit; results["end_of_life_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["end_of_life_emissions"] = 0; }
  try { const v = (results["material_emissions"] ?? 0) + (results["manufacturing_emissions"] ?? 0) + (results["transport_emissions"] ?? 0) + (results["use_phase_emissions"] ?? 0) + (results["end_of_life_emissions"] ?? 0); results["total_carbon_footprint"] = Number.isFinite(v) ? v : 0; } catch { results["total_carbon_footprint"] = 0; }
  return results;
}


export function calculateProduct_carbon_footprint(input: Product_carbon_footprintInput): Product_carbon_footprintOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_carbon_footprint"] ?? 0;
  const breakdown = {
    material_emissions: values["material_emissions"] ?? 0,
    manufacturing_emissions: values["manufacturing_emissions"] ?? 0,
    transport_emissions: values["transport_emissions"] ?? 0,
    use_phase_emissions: values["use_phase_emissions"] ?? 0,
    end_of_life_emissions: values["end_of_life_emissions"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Material Emission Factor","Low Recycled Content","Inefficient Transport Mode","High Use Phase Energy"];
  const suggestedActions: string[] = ["Increase Recycled Content","Switch to Renewable Energy","Optimize Transport Logistics","Improve Use Phase Efficiency","Enhance End-of-Life Recycling"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Product_carbon_footprintOutput {
  totalWasteCost: number;
  breakdown: { material_emissions: number; manufacturing_emissions: number; transport_emissions: number; use_phase_emissions: number; end_of_life_emissions: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
