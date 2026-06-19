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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Logistics_route_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planned_stops * input.fuel_cost_per_km; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.planned_stops * input.fuel_cost_per_km; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.planned_stops * input.fuel_cost_per_km * 1 * (input.route_distance_km * input.average_speed_kmh); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.route_distance_km; results["factor_route_distance_km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_route_distance_km"] = 0; }
  try { const v = input.average_speed_kmh; results["factor_average_speed_kmh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_average_speed_kmh"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLogistics_route_loss_calculator(input: Logistics_route_loss_calculatorInput): Logistics_route_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
