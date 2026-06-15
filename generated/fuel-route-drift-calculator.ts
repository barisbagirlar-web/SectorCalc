// Auto-generated from fuel-route-drift-calculator-schema.json
import * as z from 'zod';

export interface Fuel_route_drift_calculatorInput {
  planned_distance_km: number;
  actual_distance_km: number;
  fuel_consumption_rate: number;
  fuel_price_per_liter: number;
  load_weight_tonnes: number;
  terrain_factor: string;
  traffic_condition: string;
  driver_behavior_score: number;
  vehicle_age_years: number;
  include_hidden_losses: boolean;
}

export const Fuel_route_drift_calculatorInputSchema = z.object({
  planned_distance_km: z.number().min(0).max(5000).default(100),
  actual_distance_km: z.number().min(0).max(5000).default(110),
  fuel_consumption_rate: z.number().min(0).max(100).default(35),
  fuel_price_per_liter: z.number().min(0).max(10).default(1.5),
  load_weight_tonnes: z.number().min(0).max(50).default(20),
  terrain_factor: z.enum(['flat', 'hilly', 'mountainous']).default('flat'),
  traffic_condition: z.enum(['low', 'moderate', 'heavy']).default('low'),
  driver_behavior_score: z.number().min(0).max(100).default(80),
  vehicle_age_years: z.number().min(0).max(20).default(3),
  include_hidden_losses: z.boolean().default(true),
});

function evaluateAllFormulas(input: Fuel_route_drift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["drift_distance"] = input.actual_distance_km - input.planned_distance_km; } catch { results["drift_distance"] = 0; }
  try { results["drift_percentage"] = ((results["drift_distance"] ?? 0) / input.planned_distance_km) * 100; } catch { results["drift_percentage"] = 0; }
  try { results["adjusted_fuel_rate"] = input.fuel_consumption_rate * input.terrain_factor * input.traffic_condition * (1 + (input.load_weight_tonnes * 0.005)) * (1 - (input.driver_behavior_score * 0.002)) * (1 + (input.vehicle_age_years * 0.02)); } catch { results["adjusted_fuel_rate"] = 0; }
  try { results["planned_fuel_consumption"] = (input.planned_distance_km / 100) * (results["adjusted_fuel_rate"] ?? 0); } catch { results["planned_fuel_consumption"] = 0; }
  try { results["actual_fuel_consumption"] = (input.actual_distance_km / 100) * (results["adjusted_fuel_rate"] ?? 0); } catch { results["actual_fuel_consumption"] = 0; }
  try { results["excess_fuel_consumption"] = (results["actual_fuel_consumption"] ?? 0) - (results["planned_fuel_consumption"] ?? 0); } catch { results["excess_fuel_consumption"] = 0; }
  try { results["excess_fuel_cost"] = (results["excess_fuel_consumption"] ?? 0) * input.fuel_price_per_liter; } catch { results["excess_fuel_cost"] = 0; }
  return results;
}


export function calculateFuel_route_drift_calculator(input: Fuel_route_drift_calculatorInput): Fuel_route_drift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_excess_fuel_cost"] ?? 0;
  const breakdown = {
    drift_distance_km: values["drift_distance_km"] ?? 0,
    drift_percentage: values["drift_percentage"] ?? 0,
    adjusted_fuel_rate: values["adjusted_fuel_rate"] ?? 0,
    planned_fuel_consumption: values["planned_fuel_consumption"] ?? 0,
    actual_fuel_consumption: values["actual_fuel_consumption"] ?? 0,
    excess_fuel_consumption: values["excess_fuel_consumption"] ?? 0,
    excess_fuel_cost: values["excess_fuel_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Tire Pressure Loss","Engine Wear","Aerodynamic Drag","Idling Time"];
  const suggestedActions: string[] = ["Re-route planning: Use GPS historical data to avoid congestion and reduce drift.","Driver training: Improve eco-driving score through Lean Six Sigma coaching.","Vehicle maintenance: Schedule tire pressure checks and engine tune-ups.","Load optimization: Reduce unnecessary weight to lower fuel consumption.","Implement telematics: Real-time monitoring to detect and correct drift immediately."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-route comparison","Real-time GPS integration"],
  };
}


export interface Fuel_route_drift_calculatorOutput {
  totalWasteCost: number;
  breakdown: { drift_distance_km: number; drift_percentage: number; adjusted_fuel_rate: number; planned_fuel_consumption: number; actual_fuel_consumption: number; excess_fuel_consumption: number; excess_fuel_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
