// Auto-generated from passing-sight-distance-calculator-schema.json
import * as z from 'zod';

export interface Passing_sight_distance_calculatorInput {
  initialSpeed: number;
  targetSpeed: number;
  acceleration: number;
  timeConstant: number;
  perceptionReactionTime: number;
  clearanceDistance: number;
  opposingSpeed: number;
}

export const Passing_sight_distance_calculatorInputSchema = z.object({
  initialSpeed: z.number().default(80),
  targetSpeed: z.number().default(100),
  acceleration: z.number().default(1.5),
  timeConstant: z.number().default(3),
  perceptionReactionTime: z.number().default(1.5),
  clearanceDistance: z.number().default(30),
  opposingSpeed: z.number().default(80),
});

function evaluateAllFormulas(input: Passing_sight_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialSpeed / 3.6; results["vInitial"] = Number.isFinite(v) ? v : 0; } catch { results["vInitial"] = 0; }
  try { const v = input.targetSpeed / 3.6; results["vTarget"] = Number.isFinite(v) ? v : 0; } catch { results["vTarget"] = 0; }
  try { const v = input.opposingSpeed / 3.6; results["vOpp"] = Number.isFinite(v) ? v : 0; } catch { results["vOpp"] = 0; }
  try { const v = ((results["vTarget"] ?? 0) - (results["vInitial"] ?? 0)) / input.acceleration; results["tAcc"] = Number.isFinite(v) ? v : 0; } catch { results["tAcc"] = 0; }
  try { const v = (results["tAcc"] ?? 0) + input.timeConstant; results["t2"] = Number.isFinite(v) ? v : 0; } catch { results["t2"] = 0; }
  try { const v = (results["vInitial"] ?? 0) * input.perceptionReactionTime; results["d1"] = Number.isFinite(v) ? v : 0; } catch { results["d1"] = 0; }
  try { const v = (results["vInitial"] ?? 0) * (results["tAcc"] ?? 0) + 0.5 * input.acceleration * (results["tAcc"] ?? 0) ** 2; results["dAcc"] = Number.isFinite(v) ? v : 0; } catch { results["dAcc"] = 0; }
  try { const v = (results["vTarget"] ?? 0) * input.timeConstant; results["dConst"] = Number.isFinite(v) ? v : 0; } catch { results["dConst"] = 0; }
  try { const v = (results["dAcc"] ?? 0) + (results["dConst"] ?? 0); results["d2"] = Number.isFinite(v) ? v : 0; } catch { results["d2"] = 0; }
  try { const v = input.clearanceDistance; results["d3"] = Number.isFinite(v) ? v : 0; } catch { results["d3"] = 0; }
  try { const v = (results["vOpp"] ?? 0) * (2/3) * (results["t2"] ?? 0); results["d4"] = Number.isFinite(v) ? v : 0; } catch { results["d4"] = 0; }
  try { const v = (results["d1"] ?? 0) + (results["d2"] ?? 0) + (results["d3"] ?? 0) + (results["d4"] ?? 0); results["passingSightDistance"] = Number.isFinite(v) ? v : 0; } catch { results["passingSightDistance"] = 0; }
  return results;
}


export function calculatePassing_sight_distance_calculator(input: Passing_sight_distance_calculatorInput): Passing_sight_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["passingSightDistance"] ?? 0;
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


export interface Passing_sight_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
