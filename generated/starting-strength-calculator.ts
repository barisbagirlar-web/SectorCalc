// Auto-generated from starting-strength-calculator-schema.json
import * as z from 'zod';

export interface Starting_strength_calculatorInput {
  weight: number;
  reps: number;
  startingPercentage: number;
  bodyweight: number;
}

export const Starting_strength_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
  startingPercentage: z.number().default(80),
  bodyweight: z.number().default(80),
});

function evaluateAllFormulas(input: Starting_strength_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps/30); results["estimated1RM"] = Number.isFinite(v) ? v : 0; } catch { results["estimated1RM"] = 0; }
  try { const v = (results["estimated1RM"] ?? 0) * (input.startingPercentage/100); results["startingWeight"] = Number.isFinite(v) ? v : 0; } catch { results["startingWeight"] = 0; }
  try { const v = (results["startingWeight"] ?? 0) / input.bodyweight; results["weightRatio"] = Number.isFinite(v) ? v : 0; } catch { results["weightRatio"] = 0; }
  return results;
}


export function calculateStarting_strength_calculator(input: Starting_strength_calculatorInput): Starting_strength_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["startingWeight"] ?? 0;
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


export interface Starting_strength_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
