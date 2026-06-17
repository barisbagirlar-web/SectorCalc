// Auto-generated from push-up-calculator-schema.json
import * as z from 'zod';

export interface Push_up_calculatorInput {
  mass: number;
  angle: number;
  frictionCoeff: number;
  distance: number;
  time: number;
  gravity: number;
}

export const Push_up_calculatorInputSchema = z.object({
  mass: z.number().default(100),
  angle: z.number().default(30),
  frictionCoeff: z.number().default(0.3),
  distance: z.number().default(5),
  time: z.number().default(10),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Push_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angle * Math.PI / 180; results["angleRad"] = Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = input.mass * input.gravity * Math.sin((results["angleRad"] ?? 0)); results["fgParallel"] = Number.isFinite(v) ? v : 0; } catch { results["fgParallel"] = 0; }
  try { const v = input.mass * input.gravity * Math.cos((results["angleRad"] ?? 0)); results["fn"] = Number.isFinite(v) ? v : 0; } catch { results["fn"] = 0; }
  try { const v = input.frictionCoeff * (results["fn"] ?? 0); results["ff"] = Number.isFinite(v) ? v : 0; } catch { results["ff"] = 0; }
  try { const v = (results["fgParallel"] ?? 0) + (results["ff"] ?? 0); results["totalForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalForce"] = 0; }
  try { const v = (results["totalForce"] ?? 0) * input.distance; results["work"] = Number.isFinite(v) ? v : 0; } catch { results["work"] = 0; }
  try { const v = input.time !== 0 ? (results["work"] ?? 0) / input.time : 0; results["power"] = Number.isFinite(v) ? v : 0; } catch { results["power"] = 0; }
  return results;
}


export function calculatePush_up_calculator(input: Push_up_calculatorInput): Push_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalForce"] ?? 0;
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
