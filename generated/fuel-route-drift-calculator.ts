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
  dataConfidence?: number;
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
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fuel_route_drift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.load_weight_tonnes * input.fuel_price_per_liter; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.load_weight_tonnes * input.fuel_price_per_liter * (1 + (input.fuel_consumption_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.load_weight_tonnes * input.fuel_price_per_liter * (1 + (input.fuel_consumption_rate / 100)) * (input.planned_distance_km); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.planned_distance_km; results["factor_planned_distance_km"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_planned_distance_km"] = Number.NaN; }
  return results;
}


export function calculateFuel_route_drift_calculator(input: Fuel_route_drift_calculatorInput): Fuel_route_drift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_planned_distance_km: toNumericFormulaValue(values["factor_planned_distance_km"])
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-route comparison","Real-time GPS integration"],
  };
}


export interface Fuel_route_drift_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_planned_distance_km: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fuel_route_drift_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_planned_distance_km"],
} as const;

