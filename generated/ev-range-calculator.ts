// Auto-generated from ev-range-calculator-schema.json
import * as z from 'zod';

export interface Ev_range_calculatorInput {
  battery_capacity: number;
  base_consumption: number;
  temperature_factor: number;
  driving_style_factor: number;
  auxiliary_power: number;
  average_speed: number;
}

export const Ev_range_calculatorInputSchema = z.object({
  battery_capacity: z.number().default(60),
  base_consumption: z.number().default(180),
  temperature_factor: z.number().default(1),
  driving_style_factor: z.number().default(1),
  auxiliary_power: z.number().default(500),
  average_speed: z.number().default(60),
});

function evaluateAllFormulas(input: Ev_range_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.base_consumption * input.temperature_factor * input.driving_style_factor + (input.auxiliary_power / input.average_speed); results["effective_consumption"] = Number.isFinite(v) ? v : 0; } catch { results["effective_consumption"] = 0; }
  try { const v = (input.battery_capacity * 1000) / input.base_consumption; results["optimal_range_km"] = Number.isFinite(v) ? v : 0; } catch { results["optimal_range_km"] = 0; }
  try { const v = (input.battery_capacity * 1000) / (input.base_consumption * input.temperature_factor * input.driving_style_factor + (input.auxiliary_power / input.average_speed)); results["estimated_range_km"] = Number.isFinite(v) ? v : 0; } catch { results["estimated_range_km"] = 0; }
  return results;
}


export function calculateEv_range_calculator(input: Ev_range_calculatorInput): Ev_range_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effective_consumption"] ?? 0;
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


export interface Ev_range_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
