// Auto-generated from free-fall-calculator-schema.json
import * as z from 'zod';

export interface Free_fall_calculatorInput {
  initialHeight: number;
  initialVelocity: number;
  accelerationDueToGravity: number;
  mass: number;
}

export const Free_fall_calculatorInputSchema = z.object({
  initialHeight: z.number().default(10),
  initialVelocity: z.number().default(0),
  accelerationDueToGravity: z.number().default(9.80665),
  mass: z.number().default(1),
});

function evaluateAllFormulas(input: Free_fall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (-input.initialVelocity + Math.sqrt(input.initialVelocity**2 + 2 * input.accelerationDueToGravity * input.initialHeight)) / input.accelerationDueToGravity; results["timeOfFall"] = Number.isFinite(v) ? v : 0; } catch { results["timeOfFall"] = 0; }
  try { const v = Math.sqrt(input.initialVelocity**2 + 2 * input.accelerationDueToGravity * input.initialHeight); results["finalVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["finalVelocity"] = 0; }
  try { const v = 0.5 * input.mass * (input.initialVelocity**2 + 2 * input.accelerationDueToGravity * input.initialHeight); results["kineticEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["kineticEnergy"] = 0; }
  return results;
}


export function calculateFree_fall_calculator(input: Free_fall_calculatorInput): Free_fall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["timeOfFall"] ?? 0;
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


export interface Free_fall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
