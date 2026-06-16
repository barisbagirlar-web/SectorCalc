// Auto-generated from stair-calculator-schema.json
import * as z from 'zod';

export interface Stair_calculatorInput {
  totalRise: number;
  numberOfRisers: number;
  treadDepth: number;
  stairWidth: number;
}

export const Stair_calculatorInputSchema = z.object({
  totalRise: z.number().default(280),
  numberOfRisers: z.number().default(15),
  treadDepth: z.number().default(28),
  stairWidth: z.number().default(100),
});

function evaluateAllFormulas(input: Stair_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise / input.numberOfRisers; results["riserHeight"] = Number.isFinite(v) ? v : 0; } catch { results["riserHeight"] = 0; }
  try { const v = input.numberOfRisers - 1; results["numberOfTreads"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfTreads"] = 0; }
  try { const v = input.treadDepth * (input.numberOfRisers - 1); results["totalRun"] = Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.totalRise, 2) + Math.pow(input.treadDepth * (input.numberOfRisers - 1), 2)); results["stringerLength"] = Number.isFinite(v) ? v : 0; } catch { results["stringerLength"] = 0; }
  try { const v = Math.atan(input.totalRise / (input.treadDepth * (input.numberOfRisers - 1))) * (180 / Math.PI); results["stairAngle"] = Number.isFinite(v) ? v : 0; } catch { results["stairAngle"] = 0; }
  return results;
}


export function calculateStair_calculator(input: Stair_calculatorInput): Stair_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["stringerLength"] ?? 0;
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


export interface Stair_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
