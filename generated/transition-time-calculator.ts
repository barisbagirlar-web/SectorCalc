// Auto-generated from transition-time-calculator-schema.json
import * as z from 'zod';

export interface Transition_time_calculatorInput {
  distance: number;
  acceleration: number;
  maxVelocity: number;
  preDelay: number;
  postSettling: number;
}

export const Transition_time_calculatorInputSchema = z.object({
  distance: z.number().default(1.5),
  acceleration: z.number().default(2.5),
  maxVelocity: z.number().default(3),
  preDelay: z.number().default(0.1),
  postSettling: z.number().default(0.2),
});

function evaluateAllFormulas(input: Transition_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.preDelay + (input.distance < (input.maxVelocity**2 / input.acceleration) ? 2 * Math.sqrt(input.distance / input.acceleration) : (input.distance / input.maxVelocity + input.maxVelocity / input.acceleration)) + input.postSettling; results["transitionTime"] = Number.isFinite(v) ? v : 0; } catch { results["transitionTime"] = 0; }
  try { const v = input.preDelay; results["preDelayTime"] = Number.isFinite(v) ? v : 0; } catch { results["preDelayTime"] = 0; }
  try { const v = input.distance < (input.maxVelocity**2 / input.acceleration) ? 2 * Math.sqrt(input.distance / input.acceleration) : (input.distance / input.maxVelocity + input.maxVelocity / input.acceleration); results["motionTime"] = Number.isFinite(v) ? v : 0; } catch { results["motionTime"] = 0; }
  try { const v = input.postSettling; results["postSettlingTime"] = Number.isFinite(v) ? v : 0; } catch { results["postSettlingTime"] = 0; }
  return results;
}


export function calculateTransition_time_calculator(input: Transition_time_calculatorInput): Transition_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["transitionTime"] ?? 0;
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


export interface Transition_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
