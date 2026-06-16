// Auto-generated from projectile-motion-calculator-schema.json
import * as z from 'zod';

export interface Projectile_motion_calculatorInput {
  initialVelocity: number;
  launchAngle: number;
  initialHeight: number;
  gravity: number;
}

export const Projectile_motion_calculatorInputSchema = z.object({
  initialVelocity: z.number().default(10),
  launchAngle: z.number().default(45),
  initialHeight: z.number().default(0),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Projectile_motion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180) + Math.sqrt(Math.pow(input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180), 2) + 2 * input.gravity * input.initialHeight)) / input.gravity; results["timeOfFlight"] = Number.isFinite(v) ? v : 0; } catch { results["timeOfFlight"] = 0; }
  try { const v = input.initialVelocity * Math.cos(input.launchAngle * Math.PI / 180) * ((input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180) + Math.sqrt(Math.pow(input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180), 2) + 2 * input.gravity * input.initialHeight)) / input.gravity); results["range"] = Number.isFinite(v) ? v : 0; } catch { results["range"] = 0; }
  try { const v = input.initialHeight + Math.pow(input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180), 2) / (2 * input.gravity); results["maxHeight"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeight"] = 0; }
  return results;
}


export function calculateProjectile_motion_calculator(input: Projectile_motion_calculatorInput): Projectile_motion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["range"] ?? 0;
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


export interface Projectile_motion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
