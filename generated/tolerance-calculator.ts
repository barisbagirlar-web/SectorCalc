// Auto-generated from tolerance-calculator-schema.json
import * as z from 'zod';

export interface Tolerance_calculatorInput {
  basicSize: number;
  holeUpperDev: number;
  holeLowerDev: number;
  shaftUpperDev: number;
  shaftLowerDev: number;
}

export const Tolerance_calculatorInputSchema = z.object({
  basicSize: z.number().default(50),
  holeUpperDev: z.number().default(0.025),
  holeLowerDev: z.number().default(0),
  shaftUpperDev: z.number().default(-0.009),
  shaftLowerDev: z.number().default(-0.025),
});

function evaluateAllFormulas(input: Tolerance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.basicSize + input.holeUpperDev) - (input.basicSize + input.shaftLowerDev); results["maxClearance"] = Number.isFinite(v) ? v : 0; } catch { results["maxClearance"] = 0; }
  try { const v = (input.basicSize + input.holeLowerDev) - (input.basicSize + input.shaftUpperDev); results["minClearance"] = Number.isFinite(v) ? v : 0; } catch { results["minClearance"] = 0; }
  try { const v = input.holeUpperDev - input.holeLowerDev; results["holeTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["holeTolerance"] = 0; }
  try { const v = input.shaftUpperDev - input.shaftLowerDev; results["shaftTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["shaftTolerance"] = 0; }
  return results;
}


export function calculateTolerance_calculator(input: Tolerance_calculatorInput): Tolerance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxClearance"] ?? 0;
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


export interface Tolerance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
