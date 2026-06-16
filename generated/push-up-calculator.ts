// Auto-generated from push-up-calculator-schema.json
import * as z from 'zod';

export interface Push_up_calculatorInput {
  mass: number;
  angle: number;
  mu: number;
  distance: number;
  time: number;
  g: number;
}

export const Push_up_calculatorInputSchema = z.object({
  mass: z.number().default(100),
  angle: z.number().default(30),
  mu: z.number().default(0.3),
  distance: z.number().default(5),
  time: z.number().default(10),
  g: z.number().default(9.81),
});

function evaluateAllFormulas(input: Push_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass * input.g * (Math.sin(input.angle * Math.PI / 180) + input.mu * Math.cos(input.angle * Math.PI / 180)); results["pushForce"] = Number.isFinite(v) ? v : 0; } catch { results["pushForce"] = 0; }
  try { const v = input.mass * input.g * (Math.sin(input.angle * Math.PI / 180) + input.mu * Math.cos(input.angle * Math.PI / 180)) * input.distance; results["work"] = Number.isFinite(v) ? v : 0; } catch { results["work"] = 0; }
  try { const v = input.mass * input.g * (Math.sin(input.angle * Math.PI / 180) + input.mu * Math.cos(input.angle * Math.PI / 180)) * input.distance / input.time; results["power"] = Number.isFinite(v) ? v : 0; } catch { results["power"] = 0; }
  return results;
}


export function calculatePush_up_calculator(input: Push_up_calculatorInput): Push_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pushForce"] ?? 0;
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


export interface Push_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
