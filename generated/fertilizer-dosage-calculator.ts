// Auto-generated from fertilizer-dosage-calculator-schema.json
import * as z from 'zod';

export interface Fertilizer_dosage_calculatorInput {
  crop_type: string;
  target_yield: number;
  soil_nitrogen: number;
  soil_phosphorus: number;
  soil_potassium: number;
  application_efficiency: number;
  fertilizer_type_n: string;
  fertilizer_type_p: string;
  fertilizer_type_k: string;
  soil_moisture: number;
  rainfall_forecast: number;
  organic_matter: number;
}

export const Fertilizer_dosage_calculatorInputSchema = z.object({
  crop_type: z.enum(['corn', 'wheat', 'soybean', 'rice', 'cotton']).default('corn'),
  target_yield: z.number().min(1000).max(20000).default(8000),
  soil_nitrogen: z.number().min(0).max(100).default(15),
  soil_phosphorus: z.number().min(0).max(80).default(10),
  soil_potassium: z.number().min(0).max(400).default(120),
  application_efficiency: z.number().min(30).max(95).default(70),
  fertilizer_type_n: z.enum(['urea', 'ammonium_nitrate', 'ammonium_sulfate', 'anhydrous_ammonia']).default('urea'),
  fertilizer_type_p: z.enum(['dap', 'map', 'superphosphate', 'tsp']).default('dap'),
  fertilizer_type_k: z.enum(['mop', 'sop', 'k_magnesia']).default('mop'),
  soil_moisture: z.number().min(5).max(50).default(20),
  rainfall_forecast: z.number().min(0).max(200).default(25),
  organic_matter: z.number().min(0.5).max(10).default(2.5),
});

function evaluateAllFormulas(input: Fertilizer_dosage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.target_yield * 0.017; results["nutrient_demand_n"] = Number.isFinite(v) ? v : 0; } catch { results["nutrient_demand_n"] = 0; }
  try { const v = input.target_yield * 0.006; results["nutrient_demand_p"] = Number.isFinite(v) ? v : 0; } catch { results["nutrient_demand_p"] = 0; }
  try { const v = input.target_yield * 0.015; results["nutrient_demand_k"] = Number.isFinite(v) ? v : 0; } catch { results["nutrient_demand_k"] = 0; }
  try { const v = input.soil_nitrogen * 2.0 + input.organic_matter * 10; results["soil_supply_n"] = Number.isFinite(v) ? v : 0; } catch { results["soil_supply_n"] = 0; }
  try { const v = input.soil_phosphorus * 1.5; results["soil_supply_p"] = Number.isFinite(v) ? v : 0; } catch { results["soil_supply_p"] = 0; }
  try { const v = input.soil_potassium * 0.8; results["soil_supply_k"] = Number.isFinite(v) ? v : 0; } catch { results["soil_supply_k"] = 0; }
  try { const v = Math.max(0, ((results["nutrient_demand_n"] ?? 0) - (results["soil_supply_n"] ?? 0)) / (input.application_efficiency / 100)); results["net_requirement_n"] = Number.isFinite(v) ? v : 0; } catch { results["net_requirement_n"] = 0; }
  try { const v = Math.max(0, ((results["nutrient_demand_p"] ?? 0) - (results["soil_supply_p"] ?? 0)) / (input.application_efficiency / 100)); results["net_requirement_p"] = Number.isFinite(v) ? v : 0; } catch { results["net_requirement_p"] = 0; }
  try { const v = Math.max(0, ((results["nutrient_demand_k"] ?? 0) - (results["soil_supply_k"] ?? 0)) / (input.application_efficiency / 100)); results["net_requirement_k"] = Number.isFinite(v) ? v : 0; } catch { results["net_requirement_k"] = 0; }
  try { const v = (results["net_requirement_n"] ?? 0) / n_concentration; results["fertilizer_rate_n"] = Number.isFinite(v) ? v : 0; } catch { results["fertilizer_rate_n"] = 0; }
  try { const v = (results["net_requirement_p"] ?? 0) / p_concentration; results["fertilizer_rate_p"] = Number.isFinite(v) ? v : 0; } catch { results["fertilizer_rate_p"] = 0; }
  try { const v = (results["net_requirement_k"] ?? 0) / k_concentration; results["fertilizer_rate_k"] = Number.isFinite(v) ? v : 0; } catch { results["fertilizer_rate_k"] = 0; }
  try { const v = 1 + (input.rainfall_forecast / 100) * (1 - input.soil_moisture / 100) * 0.3; results["loss_factor_n"] = Number.isFinite(v) ? v : 0; } catch { results["loss_factor_n"] = 0; }
  try { const v = (results["fertilizer_rate_n"] ?? 0) * (results["loss_factor_n"] ?? 0); results["adjusted_rate_n"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_rate_n"] = 0; }
  try { const v = (results["fertilizer_rate_p"] ?? 0); results["adjusted_rate_p"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_rate_p"] = 0; }
  try { const v = (results["fertilizer_rate_k"] ?? 0); results["adjusted_rate_k"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_rate_k"] = 0; }
  try { const v = (results["adjusted_rate_n"] ?? 0) * 0.50 + (results["adjusted_rate_p"] ?? 0) * 0.60 + (results["adjusted_rate_k"] ?? 0) * 0.45; results["total_fertilizer_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_fertilizer_cost"] = 0; }
  try { const v = (results["adjusted_rate_n"] ?? 0) + (results["adjusted_rate_p"] ?? 0) + (results["adjusted_rate_k"] ?? 0); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateFertilizer_dosage_calculator(input: Fertilizer_dosage_calculatorInput): Fertilizer_dosage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_result"] ?? 0;
  const breakdown = {
    nitrogen: values["nitrogen"] ?? 0,
    phosphorus: values["phosphorus"] ?? 0,
    potassium: values["potassium"] ?? 0,
    cost: values["cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Nitrogen Leaching Potential","Denitrification Risk","Phosphorus Runoff Risk"];
  const suggestedActions: string[] = ["Use split application for nitrogen","Incorporate fertilizer into soil","Consider nitrification inhibitor","Adjust timing based on weather forecast"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-field comparison","Customizable reporting dashboard"],
  };
}


export interface Fertilizer_dosage_calculatorOutput {
  totalWasteCost: number;
  breakdown: { nitrogen: number; phosphorus: number; potassium: number; cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
