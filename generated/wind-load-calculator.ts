// Auto-generated from wind-load-calculator-schema.json
import * as z from 'zod';

export interface Wind_load_calculatorInput {
  basic_wind_speed: number;
  terrain_category: string;
  building_height: number;
  exposure_factor: number;
  gust_factor: number;
  pressure_coefficient: number;
  air_density: number;
  is_cyclic_loading: boolean;
}

export const Wind_load_calculatorInputSchema = z.object({
  basic_wind_speed: z.number().min(10).max(100).default(40),
  terrain_category: z.enum(['A', 'B', 'C', 'D']).default('B'),
  building_height: z.number().min(1).max(500).default(30),
  exposure_factor: z.number().min(0.5).max(2).default(1),
  gust_factor: z.number().min(0.7).max(1.2).default(0.85),
  pressure_coefficient: z.number().min(-1.5).max(1.5).default(0.8),
  air_density: z.number().min(1).max(1.5).default(1.225),
  is_cyclic_loading: z.boolean().default(false),
});

function evaluateAllFormulas(input: Wind_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.air_density * input.basic_wind_speed**2 * input.exposure_factor * input.gust_factor; results["velocity_pressure"] = Number.isFinite(v) ? v : 0; } catch { results["velocity_pressure"] = 0; }
  try { const v = (input.terrain_category === 'A' ? 2.01 * (input.building_height / 365.76)^(2/7.0) : (input.terrain_category === 'B' ? 2.01 * (input.building_height / 274.32)^(2/9.5) : (input.terrain_category === 'C' ? 2.01 * (input.building_height / 213.36)^(2/11.5) : (input.terrain_category === 'D' ? 2.01 * (input.building_height / 152.4)^(2/15.0) : 0)))); results["terrain_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["terrain_adjustment"] = 0; }
  try { const v = (results["velocity_pressure"] ?? 0) * input.pressure_coefficient * (results["terrain_adjustment"] ?? 0); results["design_wind_pressure"] = Number.isFinite(v) ? v : 0; } catch { results["design_wind_pressure"] = 0; }
  results["cyclic_reduction"] = 0;
  try { const v = (results["design_wind_pressure"] ?? 0) * (results["cyclic_reduction"] ?? 0); results["adjusted_wind_pressure"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_wind_pressure"] = 0; }
  try { const v = (results["adjusted_wind_pressure"] ?? 0) * 1.0; results["total_wind_force"] = Number.isFinite(v) ? v : 0; } catch { results["total_wind_force"] = 0; }
  try { const v = (results["total_wind_force"] ?? 0); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateWind_load_calculator(input: Wind_load_calculatorInput): Wind_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["wind_load"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    velocity_pressure: values["velocity_pressure"] ?? 0,
    terrain_adjustment: values["terrain_adjustment"] ?? 0,
    design_wind_pressure: values["design_wind_pressure"] ?? 0,
    cyclic_reduction: values["cyclic_reduction"] ?? 0,
    adjusted_wind_pressure: values["adjusted_wind_pressure"] ?? 0,
    total_wind_force: values["total_wind_force"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Terrain Category Mismatch","Gust Factor Uncertainty","Pressure Coefficient Variation"];
  const suggestedActions: string[] = ["Review Terrain Category","Perform Dynamic Analysis","Consider Wind Tunnel Test"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Wind_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: { velocity_pressure: number; terrain_adjustment: number; design_wind_pressure: number; cyclic_reduction: number; adjusted_wind_pressure: number; total_wind_force: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
