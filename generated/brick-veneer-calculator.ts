// Auto-generated from brick-veneer-calculator-schema.json
import * as z from 'zod';

export interface Brick_veneer_calculatorInput {
  wallWidth: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  mortarJoint: number;
  wasteFactor: number;
}

export const Brick_veneer_calculatorInputSchema = z.object({
  wallWidth: z.number().default(10),
  wallHeight: z.number().default(3),
  brickLength: z.number().default(230),
  brickHeight: z.number().default(76),
  mortarJoint: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Brick_veneer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil( (input.wallWidth * input.wallHeight) / ((input.brickLength + input.mortarJoint) * (input.brickHeight + input.mortarJoint) / 1000000) * (1 + input.wasteFactor / 100) ); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateBrick_veneer_calculator(input: Brick_veneer_calculatorInput): Brick_veneer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBricks"] ?? 0;
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


export interface Brick_veneer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
