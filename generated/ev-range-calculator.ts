// Auto-generated from ev-range-calculator-schema.json
import * as z from 'zod';

export interface Ev_range_calculatorInput {
  battery_capacity: number;
  base_consumption: number;
  temperature_factor: number;
  driving_style_factor: number;
  auxiliary_power: number;
  average_speed: number;
  dataConfidence?: number;
}

export const Ev_range_calculatorInputSchema = z.object({
  battery_capacity: z.number().default(60),
  base_consumption: z.number().default(180),
  temperature_factor: z.number().default(1),
  driving_style_factor: z.number().default(1),
  auxiliary_power: z.number().default(500),
  average_speed: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ev_range_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.base_consumption * input.temperature_factor * input.driving_style_factor + (input.auxiliary_power / input.average_speed); results["effective_consumption"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effective_consumption"] = 0; }
  try { const v = (input.battery_capacity * 1000) / input.base_consumption; results["optimal_range_km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["optimal_range_km"] = 0; }
  try { const v = (input.battery_capacity * 1000) / (input.base_consumption * input.temperature_factor * input.driving_style_factor + (input.auxiliary_power / input.average_speed)); results["estimated_range_km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimated_range_km"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEv_range_calculator(input: Ev_range_calculatorInput): Ev_range_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effective_consumption"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
