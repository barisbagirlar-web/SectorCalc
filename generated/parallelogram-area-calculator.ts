// Auto-generated from parallelogram-area-calculator-schema.json
import * as z from 'zod';

export interface Parallelogram_area_calculatorInput {
  base: number;
  height: number;
  side: number;
  angle: number;
  diagonal1: number;
  diagonal2: number;
  angleDiagonals: number;
}

export const Parallelogram_area_calculatorInputSchema = z.object({
  base: z.number().default(1),
  height: z.number().default(1),
  side: z.number().default(0),
  angle: z.number().default(0),
  diagonal1: z.number().default(0),
  diagonal2: z.number().default(0),
  angleDiagonals: z.number().default(0),
});

function evaluateAllFormulas(input: Parallelogram_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.base > 0 && input.height > 0) ? (input.base * input.height) : ((input.base > 0 && input.side > 0 && input.angle > 0) ? (input.base * input.side * Math.sin(input.angle * Math.PI / 180)) : ((input.diagonal1 > 0 && input.diagonal2 > 0 && input.angleDiagonals > 0) ? (0.5 * input.diagonal1 * input.diagonal2 * Math.sin(input.angleDiagonals * Math.PI / 180)) : 0)); results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  results["area___base___height_"] = 0;
  results["area___base___side___sin_angle__"] = 0;
  results["area___0_5___diagonal1___diagonal2___sin"] = 0;
  results["Result_in_square_meters__m___"] = 0;
  return results;
}


export function calculateParallelogram_area_calculator(input: Parallelogram_area_calculatorInput): Parallelogram_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["area"] ?? 0;
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


export interface Parallelogram_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
