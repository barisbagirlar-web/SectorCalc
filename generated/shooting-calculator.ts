// Auto-generated from shooting-calculator-schema.json
import * as z from 'zod';

export interface Shooting_calculatorInput {
  initialVelocity: number;
  angle: number;
  mass: number;
  gravity: number;
  launchHeight: number;
}

export const Shooting_calculatorInputSchema = z.object({
  initialVelocity: z.number().default(100),
  angle: z.number().default(45),
  mass: z.number().default(0.01),
  gravity: z.number().default(9.81),
  launchHeight: z.number().default(0),
});

function evaluateAllFormulas(input: Shooting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.mass * input.initialVelocity * input.initialVelocity; results["kineticEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["kineticEnergy"] = 0; }
  try { const v = (input.initialVelocity * input.initialVelocity * Math.sin(input.angle * Math.PI / 180) * Math.sin(input.angle * Math.PI / 180)) / (2 * input.gravity) + input.launchHeight; results["maxHeight"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeight"] = 0; }
  try { const v = (input.initialVelocity * Math.sin(input.angle * Math.PI / 180) + Math.sqrt((input.initialVelocity * Math.sin(input.angle * Math.PI / 180)) * (input.initialVelocity * Math.sin(input.angle * Math.PI / 180)) + 2 * input.gravity * input.launchHeight)) / input.gravity; results["timeOfFlight"] = Number.isFinite(v) ? v : 0; } catch { results["timeOfFlight"] = 0; }
  try { const v = input.initialVelocity * Math.cos(input.angle * Math.PI / 180) * ((input.initialVelocity * Math.sin(input.angle * Math.PI / 180) + Math.sqrt((input.initialVelocity * Math.sin(input.angle * Math.PI / 180)) * (input.initialVelocity * Math.sin(input.angle * Math.PI / 180)) + 2 * input.gravity * input.launchHeight)) / input.gravity); results["range"] = Number.isFinite(v) ? v : 0; } catch { results["range"] = 0; }
  return results;
}


export function calculateShooting_calculator(input: Shooting_calculatorInput): Shooting_calculatorOutput {
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


export interface Shooting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
