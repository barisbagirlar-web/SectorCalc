// Auto-generated from round-calculator-schema.json
import * as z from 'zod';

export interface Round_calculatorInput {
  diameter: number;
  length: number;
  density: number;
  quantity: number;
}

export const Round_calculatorInputSchema = z.object({
  diameter: z.number().default(50),
  length: z.number().default(1000),
  density: z.number().default(7.85),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Round_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 3.141592653589793 * input.diameter**2 * input.length * input.density / 4000000; results["weightPerBar"] = Number.isFinite(v) ? v : 0; } catch { results["weightPerBar"] = 0; }
  try { const v = 3.141592653589793 * input.diameter**2 * input.length / 4000; results["volumePerBar"] = Number.isFinite(v) ? v : 0; } catch { results["volumePerBar"] = 0; }
  try { const v = (3.141592653589793 * input.diameter**2 / 2 + 3.141592653589793 * input.diameter * input.length) / 100; results["surfaceAreaPerBar"] = Number.isFinite(v) ? v : 0; } catch { results["surfaceAreaPerBar"] = 0; }
  try { const v = (3.141592653589793 * input.diameter**2 * input.length * input.density / 4000000) * input.quantity; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (3.141592653589793 * input.diameter**2 * input.length / 4000) * input.quantity; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = ((3.141592653589793 * input.diameter**2 / 2 + 3.141592653589793 * input.diameter * input.length) / 100) * input.quantity; results["totalSurfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  return results;
}


export function calculateRound_calculator(input: Round_calculatorInput): Round_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeight"] ?? 0;
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


export interface Round_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
