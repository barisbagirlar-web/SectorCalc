// Auto-generated from stopping-sight-distance-calculator-schema.json
import * as z from 'zod';

export interface Stopping_sight_distance_calculatorInput {
  speed: number;
  reactionTime: number;
  frictionCoeff: number;
  grade: number;
  dataConfidence?: number;
}

export const Stopping_sight_distance_calculatorInputSchema = z.object({
  speed: z.number().default(50),
  reactionTime: z.number().default(2.5),
  frictionCoeff: z.number().default(0.35),
  grade: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stopping_sight_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.speed * input.reactionTime) / 3.6; results["reactionDist"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reactionDist"] = Number.NaN; }
  try { const v = (input.speed * input.reactionTime) / 3.6; results["reactionDist_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reactionDist_aux"] = Number.NaN; }
  return results;
}


export function calculateStopping_sight_distance_calculator(input: Stopping_sight_distance_calculatorInput): Stopping_sight_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reactionDist"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Stopping_sight_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
