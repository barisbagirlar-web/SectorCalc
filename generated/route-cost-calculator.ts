// Auto-generated from route-cost-calculator-schema.json
import * as z from 'zod';

export interface Route_cost_calculatorInput {
  distance_km: number;
  fuel_consumption_l_per_100km: number;
  fuel_price_per_l: number;
  driver_wage_per_hour: number;
  average_speed_kmh: number;
  maintenance_cost_per_km: number;
  toll_cost_total: number;
  load_weight_tonnes: number;
  route_type: string;
  is_return_trip: boolean;
}

export const Route_cost_calculatorInputSchema = z.object({
  distance_km: z.number().min(0).max(5000).default(100),
  fuel_consumption_l_per_100km: z.number().min(5).max(80).default(30),
  fuel_price_per_l: z.number().min(0.5).max(3).default(1.5),
  driver_wage_per_hour: z.number().min(10).max(60).default(25),
  average_speed_kmh: z.number().min(10).max(120).default(60),
  maintenance_cost_per_km: z.number().min(0.02).max(0.5).default(0.12),
  toll_cost_total: z.number().min(0).max(500).default(15),
  load_weight_tonnes: z.number().min(0).max(40).default(20),
  route_type: z.enum(['highway', 'urban', 'mixed', 'mountain']).default('highway'),
  is_return_trip: z.boolean().default(false),
});

function evaluateAllFormulas(input: Route_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["effective_distance"] = input.distance_km * (1 + (input.is_return_trip ? 1 : 0)); } catch { results["effective_distance"] = 0; }
  try { results["travel_time_hours"] = (results["effective_distance"] ?? 0) / input.average_speed_kmh; } catch { results["travel_time_hours"] = 0; }
  try { results["fuel_cost"] = (input.fuel_consumption_l_per_100km / 100) * (results["effective_distance"] ?? 0) * input.fuel_price_per_l; } catch { results["fuel_cost"] = 0; }
  try { results["labor_cost"] = (results["travel_time_hours"] ?? 0) * input.driver_wage_per_hour * 1.15; } catch { results["labor_cost"] = 0; }
  try { results["maintenance_cost"] = (results["effective_distance"] ?? 0) * input.maintenance_cost_per_km; } catch { results["maintenance_cost"] = 0; }
  try { results["total_cost"] = (results["fuel_cost"] ?? 0) + (results["labor_cost"] ?? 0) + (results["maintenance_cost"] ?? 0) + input.toll_cost_total; } catch { results["total_cost"] = 0; }
  try { results["cost_per_km"] = (results["total_cost"] ?? 0) / (results["effective_distance"] ?? 0); } catch { results["cost_per_km"] = 0; }
  return results;
}


export function calculateRoute_cost_calculator(input: Route_cost_calculatorInput): Route_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cost_per_km"] ?? 0;
  const breakdown = {
    fuel_cost: values["fuel_cost"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    maintenance_cost: values["maintenance_cost"] ?? 0,
    toll_cost_total: values["toll_cost_total"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Empty Miles","Idle Time","Fuel Waste","Route Inefficiency"];
  const suggestedActions: string[] = ["Optimize Route","Eco-Driving Training","Consolidate Loads","Preventive Maintenance","Evaluate Toll Alternatives"];
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


export interface Route_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { fuel_cost: number; labor_cost: number; maintenance_cost: number; toll_cost_total: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
