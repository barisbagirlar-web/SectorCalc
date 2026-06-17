// Auto-generated from progression-calculator-schema.json
import * as z from 'zod';

export interface Progression_calculatorInput {
  firstTerm: number;
  commonDifference: number;
  startIndex: number;
  endIndex: number;
}

export const Progression_calculatorInputSchema = z.object({
  firstTerm: z.number().default(1),
  commonDifference: z.number().default(1),
  startIndex: z.number().default(1),
  endIndex: z.number().default(10),
});

function evaluateAllFormulas(input: Progression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.endIndex - input.startIndex + 1) * (2 * input.firstTerm + input.commonDifference * (input.startIndex + input.endIndex - 2))) / 2; results["sum"] = Number.isFinite(v) ? v : 0; } catch { results["sum"] = 0; }
  try { const v = input.firstTerm + input.commonDifference * (input.startIndex - 1); results["startValue"] = Number.isFinite(v) ? v : 0; } catch { results["startValue"] = 0; }
  try { const v = input.firstTerm + input.commonDifference * (input.endIndex - 1); results["endValue"] = Number.isFinite(v) ? v : 0; } catch { results["endValue"] = 0; }
  return results;
}


export function calculateProgression_calculator(input: Progression_calculatorInput): Progression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sum"] ?? 0;
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


export interface Progression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
