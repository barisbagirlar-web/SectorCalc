// Auto-generated from work-calculator-schema.json
import * as z from 'zod';

export interface Work_calculatorInput {
  mass: number;
  distance: number;
  angle: number;
  frictionCoefficient: number;
}

export const Work_calculatorInputSchema = z.object({
  mass: z.number().default(10),
  distance: z.number().default(5),
  angle: z.number().default(30),
  frictionCoefficient: z.number().default(0.1),
});

function evaluateAllFormulas(input: Work_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angle * Math.PI / 180; results["angleRad"] = Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = input.mass * 9.81 * input.distance * Math.sin((results["angleRad"] ?? 0)); results["workAgainstGravity"] = Number.isFinite(v) ? v : 0; } catch { results["workAgainstGravity"] = 0; }
  try { const v = input.frictionCoefficient * input.mass * 9.81 * Math.cos((results["angleRad"] ?? 0)) * input.distance; results["workAgainstFriction"] = Number.isFinite(v) ? v : 0; } catch { results["workAgainstFriction"] = 0; }
  try { const v = (results["workAgainstGravity"] ?? 0) + (results["workAgainstFriction"] ?? 0); results["totalWork"] = Number.isFinite(v) ? v : 0; } catch { results["totalWork"] = 0; }
  return results;
}


export function calculateWork_calculator(input: Work_calculatorInput): Work_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWork"] ?? 0;
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


export interface Work_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
