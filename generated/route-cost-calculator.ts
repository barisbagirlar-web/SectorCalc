// @ts-nocheck
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
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Route_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance_km + input.fuel_consumption_l_per_100km + input.fuel_price_per_l; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.distance_km + input.fuel_consumption_l_per_100km + input.fuel_price_per_l; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRoute_cost_calculator(input: Route_cost_calculatorInput): Route_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Route_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
