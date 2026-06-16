// Auto-generated from stair-climbing-calculator-schema.json
import * as z from 'zod';

export interface Stair_climbing_calculatorInput {
  totalRise: number;
  treadDepth: number;
  riserHeightTarget: number;
  stairWidth: number;
}

export const Stair_climbing_calculatorInputSchema = z.object({
  totalRise: z.number().default(280),
  treadDepth: z.number().default(28),
  riserHeightTarget: z.number().default(17),
  stairWidth: z.number().default(100),
});

function evaluateAllFormulas(input: Stair_climbing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.totalRise / input.riserHeightTarget); results["numberOfSteps"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfSteps"] = 0; }
  try { const v = input.totalRise / (results["numberOfSteps"] ?? 0); results["actualRiserHeight"] = Number.isFinite(v) ? v : 0; } catch { results["actualRiserHeight"] = 0; }
  try { const v = ((results["numberOfSteps"] ?? 0) - 1) * input.treadDepth; results["totalRun"] = Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = Math.atan((results["actualRiserHeight"] ?? 0) / input.treadDepth) * (180 / Math.PI); results["stairAngle"] = Number.isFinite(v) ? v : 0; } catch { results["stairAngle"] = 0; }
  try { const v = (input.stairWidth / 100) * ((results["totalRun"] ?? 0) / 100); results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  return results;
}


export function calculateStair_climbing_calculator(input: Stair_climbing_calculatorInput): Stair_climbing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["stairAngle"] ?? 0;
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


export interface Stair_climbing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
