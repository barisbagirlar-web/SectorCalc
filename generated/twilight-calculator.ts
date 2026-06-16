// Auto-generated from twilight-calculator-schema.json
import * as z from 'zod';

export interface Twilight_calculatorInput {
  full_power: number;
  dimming_percent: number;
  exponent: number;
  operating_hours: number;
  cost_per_kwh: number;
}

export const Twilight_calculatorInputSchema = z.object({
  full_power: z.number().default(100),
  dimming_percent: z.number().default(30),
  exponent: z.number().default(2.2),
  operating_hours: z.number().default(12),
  cost_per_kwh: z.number().default(0.15),
});

function evaluateAllFormulas(input: Twilight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dimming_percent / 100) ** input.exponent; results["dimming_factor"] = Number.isFinite(v) ? v : 0; } catch { results["dimming_factor"] = 0; }
  try { const v = input.full_power * (results["dimming_factor"] ?? 0); results["actual_power"] = Number.isFinite(v) ? v : 0; } catch { results["actual_power"] = 0; }
  try { const v = (input.full_power - (results["actual_power"] ?? 0)) * input.operating_hours; results["daily_energy_saved_wh"] = Number.isFinite(v) ? v : 0; } catch { results["daily_energy_saved_wh"] = 0; }
  try { const v = (results["daily_energy_saved_wh"] ?? 0) * input.cost_per_kwh / 1000; results["daily_cost_savings"] = Number.isFinite(v) ? v : 0; } catch { results["daily_cost_savings"] = 0; }
  return results;
}


export function calculateTwilight_calculator(input: Twilight_calculatorInput): Twilight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["daily_cost_savings"] ?? 0;
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


export interface Twilight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
