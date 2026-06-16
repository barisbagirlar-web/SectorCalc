// Auto-generated from equestrian-calculator-schema.json
import * as z from 'zod';

export interface Equestrian_calculatorInput {
  load_mass: number;
  slope_percent: number;
  rolling_resistance: number;
  desired_speed: number;
  horse_pull_force: number;
  efficiency: number;
}

export const Equestrian_calculatorInputSchema = z.object({
  load_mass: z.number().default(1000),
  slope_percent: z.number().default(5),
  rolling_resistance: z.number().default(0.02),
  desired_speed: z.number().default(1.5),
  horse_pull_force: z.number().default(1000),
  efficiency: z.number().default(85),
});

function evaluateAllFormulas(input: Equestrian_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan(input.slope_percent / 100); results["angle_rad"] = Number.isFinite(v) ? v : 0; } catch { results["angle_rad"] = 0; }
  try { const v = input.load_mass * 9.81 * (Math.sin((results["angle_rad"] ?? 0)) + input.rolling_resistance * Math.cos((results["angle_rad"] ?? 0))); results["tractive_force"] = Number.isFinite(v) ? v : 0; } catch { results["tractive_force"] = 0; }
  try { const v = (results["tractive_force"] ?? 0) / (input.efficiency / 100); results["effective_force"] = Number.isFinite(v) ? v : 0; } catch { results["effective_force"] = 0; }
  try { const v = (results["effective_force"] ?? 0) * input.desired_speed; results["required_power"] = Number.isFinite(v) ? v : 0; } catch { results["required_power"] = 0; }
  try { const v = (results["required_power"] ?? 0) / 745.7; results["total_horsepower"] = Number.isFinite(v) ? v : 0; } catch { results["total_horsepower"] = 0; }
  try { const v = Math.ceil((results["effective_force"] ?? 0) / input.horse_pull_force); results["number_of_horses"] = Number.isFinite(v) ? v : 0; } catch { results["number_of_horses"] = 0; }
  return results;
}


export function calculateEquestrian_calculator(input: Equestrian_calculatorInput): Equestrian_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Gereken"] ?? 0;
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


export interface Equestrian_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
