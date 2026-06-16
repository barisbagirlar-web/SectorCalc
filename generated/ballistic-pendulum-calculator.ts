// Auto-generated from ballistic-pendulum-calculator-schema.json
import * as z from 'zod';

export interface Ballistic_pendulum_calculatorInput {
  projectile_mass: number;
  pendulum_mass: number;
  pendulum_length: number;
  angle: number;
  gravity: number;
}

export const Ballistic_pendulum_calculatorInputSchema = z.object({
  projectile_mass: z.number().default(0.01),
  pendulum_mass: z.number().default(2),
  pendulum_length: z.number().default(1.5),
  angle: z.number().default(30),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Ballistic_pendulum_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angle * Math.PI / 180; results["angle_rad"] = Number.isFinite(v) ? v : 0; } catch { results["angle_rad"] = 0; }
  try { const v = input.pendulum_length * (1 - Math.cos((results["angle_rad"] ?? 0))); results["height_rise"] = Number.isFinite(v) ? v : 0; } catch { results["height_rise"] = 0; }
  try { const v = ((input.projectile_mass + input.pendulum_mass) / input.projectile_mass) * Math.sqrt(2 * input.gravity * (results["height_rise"] ?? 0)); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  return results;
}


export function calculateBallistic_pendulum_calculator(input: Ballistic_pendulum_calculatorInput): Ballistic_pendulum_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["velocity"] ?? 0;
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


export interface Ballistic_pendulum_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
