// Auto-generated from ev-cost-calculator-schema.json
import * as z from 'zod';

export interface Ev_cost_calculatorInput {
  electricity_price: number;
  charging_efficiency: number;
  vehicle_efficiency: number;
  daily_distance: number;
  maintenance_cost_per_km: number;
}

export const Ev_cost_calculatorInputSchema = z.object({
  electricity_price: z.number().default(0.15),
  charging_efficiency: z.number().default(90),
  vehicle_efficiency: z.number().default(18),
  daily_distance: z.number().default(50),
  maintenance_cost_per_km: z.number().default(0.05),
});

function evaluateAllFormulas(input: Ev_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.daily_distance / 100 * input.vehicle_efficiency * (100 / input.charging_efficiency); results["energy_per_day"] = Number.isFinite(v) ? v : 0; } catch { results["energy_per_day"] = 0; }
  try { const v = (results["energy_per_day"] ?? 0) * input.electricity_price; results["energy_cost_per_day"] = Number.isFinite(v) ? v : 0; } catch { results["energy_cost_per_day"] = 0; }
  try { const v = input.daily_distance * input.maintenance_cost_per_km; results["maintenance_cost_per_day"] = Number.isFinite(v) ? v : 0; } catch { results["maintenance_cost_per_day"] = 0; }
  try { const v = (results["energy_cost_per_day"] ?? 0) + (results["maintenance_cost_per_day"] ?? 0); results["total_cost_per_day"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost_per_day"] = 0; }
  return results;
}


export function calculateEv_cost_calculator(input: Ev_cost_calculatorInput): Ev_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost_per_day"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ev_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
