// Auto-generated from fill-dirt-calculator-schema.json
import * as z from 'zod';

export interface Fill_dirt_calculatorInput {
  length: number;
  width: number;
  depth: number;
  compactionFactor: number;
}

export const Fill_dirt_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  depth: z.number().default(0.5),
  compactionFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Fill_dirt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.depth; results["compactVolume"] = Number.isFinite(v) ? v : 0; } catch { results["compactVolume"] = 0; }
  try { const v = (results["compactVolume"] ?? 0) * input.compactionFactor; results["looseVolume"] = Number.isFinite(v) ? v : 0; } catch { results["looseVolume"] = 0; }
  return results;
}


export function calculateFill_dirt_calculator(input: Fill_dirt_calculatorInput): Fill_dirt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["looseVolume"] ?? 0;
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


export interface Fill_dirt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
