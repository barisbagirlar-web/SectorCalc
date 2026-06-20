// Auto-generated from delivery-cost-calculator-schema.json
import * as z from 'zod';

export interface Delivery_cost_calculatorInput {
  distance_km: number;
  fuel_cost_per_liter: number;
  fuel_efficiency_kmpl: number;
  driver_wage_per_hour: number;
  average_speed_kmph: number;
  load_weight_kg: number;
  handling_cost_per_kg: number;
  vehicle_maintenance_per_km: number;
  dataConfidence?: number;
}

export const Delivery_cost_calculatorInputSchema = z.object({
  distance_km: z.number().min(0).max(5000).default(100),
  fuel_cost_per_liter: z.number().min(0).max(10).default(1.5),
  fuel_efficiency_kmpl: z.number().min(1).max(50).default(8),
  driver_wage_per_hour: z.number().min(0).max(100).default(25),
  average_speed_kmph: z.number().min(10).max(120).default(60),
  load_weight_kg: z.number().min(0).max(40000).default(1000),
  handling_cost_per_kg: z.number().min(0).max(5).default(0.1),
  vehicle_maintenance_per_km: z.number().min(0).max(1).default(0.05),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Delivery_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance_km * input.fuel_cost_per_liter * (input.fuel_efficiency_kmpl / 100) * input.driver_wage_per_hour; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.distance_km * input.fuel_cost_per_liter * (input.fuel_efficiency_kmpl / 100) * input.driver_wage_per_hour * (input.average_speed_kmph * input.load_weight_kg * input.handling_cost_per_kg * input.vehicle_maintenance_per_km); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.average_speed_kmph * input.load_weight_kg * input.handling_cost_per_kg * input.vehicle_maintenance_per_km; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDelivery_cost_calculator(input: Delivery_cost_calculatorInput): Delivery_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Delivery_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Delivery_cost_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

