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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Route_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.load_weight_tonnes * input.fuel_price_per_l; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.load_weight_tonnes * input.fuel_price_per_l; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.load_weight_tonnes * input.fuel_price_per_l * 1 * (input.distance_km * input.fuel_consumption_l_per_100km); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.distance_km; results["factor_distance_km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_distance_km"] = 0; }
  try { const v = input.fuel_consumption_l_per_100km; results["factor_fuel_consumption_l_per_100km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_fuel_consumption_l_per_100km"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoute_cost_calculator(input: Route_cost_calculatorInput): Route_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
