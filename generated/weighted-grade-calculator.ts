// Auto-generated from weighted-grade-calculator-schema.json
import * as z from 'zod';

export interface Weighted_grade_calculatorInput {
  grade1: number;
  weight1: number;
  grade2: number;
  weight2: number;
  grade3: number;
  weight3: number;
  grade4: number;
  weight4: number;
}

export const Weighted_grade_calculatorInputSchema = z.object({
  grade1: z.number().default(0),
  weight1: z.number().default(0),
  grade2: z.number().default(0),
  weight2: z.number().default(0),
  grade3: z.number().default(0),
  weight3: z.number().default(0),
  grade4: z.number().default(0),
  weight4: z.number().default(0),
});

function evaluateAllFormulas(input: Weighted_grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.grade1 * input.weight1 + input.grade2 * input.weight2 + input.grade3 * input.weight3 + input.grade4 * input.weight4) / (input.weight1 + input.weight2 + input.weight3 + input.weight4); results["weightedGrade"] = Number.isFinite(v) ? v : 0; } catch { results["weightedGrade"] = 0; }
  try { const v = input.weight1 + input.weight2 + input.weight3 + input.weight4; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.grade1 * input.weight1; results["contribution1"] = Number.isFinite(v) ? v : 0; } catch { results["contribution1"] = 0; }
  try { const v = input.grade2 * input.weight2; results["contribution2"] = Number.isFinite(v) ? v : 0; } catch { results["contribution2"] = 0; }
  try { const v = input.grade3 * input.weight3; results["contribution3"] = Number.isFinite(v) ? v : 0; } catch { results["contribution3"] = 0; }
  try { const v = input.grade4 * input.weight4; results["contribution4"] = Number.isFinite(v) ? v : 0; } catch { results["contribution4"] = 0; }
  return results;
}


export function calculateWeighted_grade_calculator(input: Weighted_grade_calculatorInput): Weighted_grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weightedGrade"] ?? 0;
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


export interface Weighted_grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
