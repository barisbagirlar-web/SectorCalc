// Auto-generated from logistics-route-loss-calculator-schema.json
import * as z from 'zod';

export interface Logistics_route_loss_calculatorInput {
  route_distance_km: number;
  average_speed_kmh: number;
  planned_stops: number;
  average_stop_time_min: number;
  traffic_delay_factor: number;
  fuel_cost_per_km: number;
  driver_wage_per_hour: number;
  vehicle_operating_cost_per_km: number;
  load_value_currency: number;
  transit_time_target_hours: number;
  route_type: string;
  use_real_time_traffic: boolean;
}

export const Logistics_route_loss_calculatorInputSchema = z.object({
  route_distance_km: z.number().min(0).max(5000).default(100),
  average_speed_kmh: z.number().min(1).max(120).default(60),
  planned_stops: z.number().min(0).max(50).default(3),
  average_stop_time_min: z.number().min(0).max(240).default(30),
  traffic_delay_factor: z.number().min(0).max(1).default(0.15),
  fuel_cost_per_km: z.number().min(0).max(10).default(0.35),
  driver_wage_per_hour: z.number().min(0).max(200).default(25),
  vehicle_operating_cost_per_km: z.number().min(0).max(5).default(0.15),
  load_value_currency: z.number().min(0).max(10000000).default(50000),
  transit_time_target_hours: z.number().min(0.1).max(168).default(4),
  route_type: z.enum(['urban', 'highway', 'mixed']).default('mixed'),
  use_real_time_traffic: z.boolean().default(false),
});

function evaluateAllFormulas(input: Logistics_route_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["ideal_driving_time_hours"] = input.route_distance_km / input.average_speed_kmh; } catch { results["ideal_driving_time_hours"] = 0; }
  try { results["total_stop_time_hours"] = input.planned_stops * (input.average_stop_time_min / 60); } catch { results["total_stop_time_hours"] = 0; }
  try { results["traffic_loss_hours"] = (results["ideal_driving_time_hours"] ?? 0) * input.traffic_delay_factor; } catch { results["traffic_loss_hours"] = 0; }
  try { results["total_transit_time_hours"] = (results["ideal_driving_time_hours"] ?? 0) + (results["total_stop_time_hours"] ?? 0) + (results["traffic_loss_hours"] ?? 0); } catch { results["total_transit_time_hours"] = 0; }
  try { results["time_loss_cost"] = ((results["total_stop_time_hours"] ?? 0) + (results["traffic_loss_hours"] ?? 0)) * input.driver_wage_per_hour; } catch { results["time_loss_cost"] = 0; }
  try { results["fuel_and_operating_cost"] = input.route_distance_km * (input.fuel_cost_per_km + input.vehicle_operating_cost_per_km); } catch { results["fuel_and_operating_cost"] = 0; }
  try { results["cargo_time_value_loss"] = input.load_value_currency * 0.05 * ((results["total_transit_time_hours"] ?? 0) - input.transit_time_target_hours) / 8760; } catch { results["cargo_time_value_loss"] = 0; }
  try { results["total_route_loss"] = (results["time_loss_cost"] ?? 0) + (results["fuel_and_operating_cost"] ?? 0) + (results["cargo_time_value_loss"] ?? 0); } catch { results["total_route_loss"] = 0; }
  return results;
}


export function calculateLogistics_route_loss_calculator(input: Logistics_route_loss_calculatorInput): Logistics_route_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_route_loss"] ?? 0;
  const breakdown = {
    time_loss_cost: values["time_loss_cost"] ?? 0,
    fuel_and_operating_cost: values["fuel_and_operating_cost"] ?? 0,
    cargo_time_value_loss: values["cargo_time_value_loss"] ?? 0,
    ideal_driving_time_hours: values["ideal_driving_time_hours"] ?? 0,
    total_stop_time_hours: values["total_stop_time_hours"] ?? 0,
    traffic_loss_hours: values["traffic_loss_hours"] ?? 0,
    total_transit_time_hours: values["total_transit_time_hours"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Stop Time","High Traffic Impact","Cargo Value at Risk","Fuel Inefficiency"];
  const suggestedActions: string[] = ["Consolidate Stops","Optimize Route for Traffic","Increase Average Speed","Streamline Loading/Unloading","Review Fuel Efficiency"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-route comparison","Benchmarking against industry standards"],
  };
}


export interface Logistics_route_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: { time_loss_cost: number; fuel_and_operating_cost: number; cargo_time_value_loss: number; ideal_driving_time_hours: number; total_stop_time_hours: number; traffic_loss_hours: number; total_transit_time_hours: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
