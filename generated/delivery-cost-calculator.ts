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
  toll_cost: number;
  insurance_rate_per_kg: number;
  overhead_percentage: number;
  is_express_delivery: boolean;
  delivery_zone: string;
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
  toll_cost: z.number().min(0).max(500).default(0),
  insurance_rate_per_kg: z.number().min(0).max(1).default(0.02),
  overhead_percentage: z.number().min(0).max(50).default(10),
  is_express_delivery: z.boolean().default(false),
  delivery_zone: z.enum(['urban', 'suburban', 'rural', 'remote']).default('urban'),
});

function evaluateAllFormulas(input: Delivery_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["fuel_cost"] = (input.distance_km / input.fuel_efficiency_kmpl) * input.fuel_cost_per_liter; } catch { results["fuel_cost"] = 0; }
  try { results["driver_cost"] = (input.distance_km / input.average_speed_kmph) * input.driver_wage_per_hour; } catch { results["driver_cost"] = 0; }
  try { results["handling_cost"] = input.load_weight_kg * input.handling_cost_per_kg; } catch { results["handling_cost"] = 0; }
  try { results["maintenance_cost"] = input.distance_km * input.vehicle_maintenance_per_km; } catch { results["maintenance_cost"] = 0; }
  try { results["insurance_cost"] = input.load_weight_kg * input.insurance_rate_per_kg; } catch { results["insurance_cost"] = 0; }
  try { results["direct_cost"] = (results["fuel_cost"] ?? 0) + (results["driver_cost"] ?? 0) + (results["handling_cost"] ?? 0) + (results["maintenance_cost"] ?? 0) + (results["insurance_cost"] ?? 0) + input.toll_cost; } catch { results["direct_cost"] = 0; }
  try { results["overhead_cost"] = (results["direct_cost"] ?? 0) * (input.overhead_percentage / 100); } catch { results["overhead_cost"] = 0; }
  results["zone_multiplier"] = 0;
  results["express_multiplier"] = 0;
  try { results["total_delivery_cost"] = ((results["direct_cost"] ?? 0) + (results["overhead_cost"] ?? 0)) * (results["zone_multiplier"] ?? 0) * (results["express_multiplier"] ?? 0); } catch { results["total_delivery_cost"] = 0; }
  return results;
}


export function calculateDelivery_cost_calculator(input: Delivery_cost_calculatorInput): Delivery_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_delivery_cost"] ?? 0;
  const breakdown = {
    fuel_cost: values["fuel_cost"] ?? 0,
    driver_cost: values["driver_cost"] ?? 0,
    handling_cost: values["handling_cost"] ?? 0,
    maintenance_cost: values["maintenance_cost"] ?? 0,
    insurance_cost: values["insurance_cost"] ?? 0,
    toll_cost: values["toll_cost"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0,
    zone_multiplier: values["zone_multiplier"] ?? 0,
    express_multiplier: values["express_multiplier"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Empty Return Miles","Waiting Time Cost","Damage Risk Cost"];
  const suggestedActions: string[] = ["Optimize Route","Consolidate Shipments","Negotiate Fuel Surcharge","Reduce Overhead"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Delivery_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { fuel_cost: number; driver_cost: number; handling_cost: number; maintenance_cost: number; insurance_cost: number; toll_cost: number; overhead_cost: number; zone_multiplier: number; express_multiplier: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
