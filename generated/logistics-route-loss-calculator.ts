// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Logistics_route_loss_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.route_distance_km + input.average_speed_kmh + input.planned_stops; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.route_distance_km + input.average_speed_kmh + input.planned_stops; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLogistics_route_loss_calculator(input: Logistics_route_loss_calculatorInput): Logistics_route_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
