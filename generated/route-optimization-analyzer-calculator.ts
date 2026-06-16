// Auto-generated from route-optimization-analyzer-calculator-schema.json
import * as z from 'zod';

export interface Route_optimization_analyzer_calculatorInput {
  num_stops: number;
  total_distance: number;
  avg_speed: number;
  dwell_time_per_stop: number;
  fuel_cost_per_km: number;
  driver_hourly_rate: number;
  vehicle_type: string;
  traffic_condition: string;
  use_optimization: boolean;
}

export const Route_optimization_analyzer_calculatorInputSchema = z.object({
  num_stops: z.number().min(1).max(200).default(10),
  total_distance: z.number().min(0).max(5000).default(150),
  avg_speed: z.number().min(5).max(120).default(40),
  dwell_time_per_stop: z.number().min(0).max(120).default(10),
  fuel_cost_per_km: z.number().min(0).max(10).default(1.2),
  driver_hourly_rate: z.number().min(0).max(100).default(25),
  vehicle_type: z.enum(['van', 'truck_light', 'truck_heavy', 'refrigerated']).default('van'),
  traffic_condition: z.enum(['light', 'moderate', 'heavy']).default('moderate'),
  use_optimization: z.boolean().default(true),
});

function evaluateAllFormulas(input: Route_optimization_analyzer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_distance / input.avg_speed; results["total_drive_time"] = Number.isFinite(v) ? v : 0; } catch { results["total_drive_time"] = 0; }
  try { const v = input.num_stops * input.dwell_time_per_stop / 60; results["total_dwell_time"] = Number.isFinite(v) ? v : 0; } catch { results["total_dwell_time"] = 0; }
  try { const v = (results["total_drive_time"] ?? 0) + (results["total_dwell_time"] ?? 0); results["total_travel_time"] = Number.isFinite(v) ? v : 0; } catch { results["total_travel_time"] = 0; }
  try { const v = input.total_distance * input.fuel_cost_per_km; results["fuel_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["fuel_cost_total"] = 0; }
  try { const v = (results["total_travel_time"] ?? 0) * input.driver_hourly_rate; results["driver_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["driver_cost_total"] = 0; }
  try { const v = input.num_stops / (results["total_travel_time"] ?? 0); results["stops_per_hour"] = Number.isFinite(v) ? v : 0; } catch { results["stops_per_hour"] = 0; }
  try { const v = (results["fuel_cost_total"] ?? 0) + (results["driver_cost_total"] ?? 0); results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  return results;
}


export function calculateRoute_optimization_analyzer_calculator(input: Route_optimization_analyzer_calculatorInput): Route_optimization_analyzer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost"] ?? 0;
  const breakdown = {
    fuel_cost_total: values["fuel_cost_total"] ?? 0,
    driver_cost_total: values["driver_cost_total"] ?? 0,
    total_travel_time: values["total_travel_time"] ?? 0,
    stops_per_hour: values["stops_per_hour"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Dwell Time","Inefficient Route Factor","Fuel Waste"];
  const suggestedActions: string[] = ["Consolidate Stops","Schedule Off-Peak","Consider Fuel-Efficient Vehicle"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time GPS integration"],
  };
}


export interface Route_optimization_analyzer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { fuel_cost_total: number; driver_cost_total: number; total_travel_time: number; stops_per_hour: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
