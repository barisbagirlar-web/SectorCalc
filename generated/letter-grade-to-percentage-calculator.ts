// Auto-generated from letter-grade-to-percentage-calculator-schema.json
import * as z from 'zod';

export interface Letter_grade_to_percentage_calculatorInput {
  gradePoint: number;
  slope: number;
  intercept: number;
  clampMin: number;
  clampMax: number;
}

export const Letter_grade_to_percentage_calculatorInputSchema = z.object({
  gradePoint: z.number().default(4),
  slope: z.number().default(10),
  intercept: z.number().default(55),
  clampMin: z.number().default(0),
  clampMax: z.number().default(100),
});

function evaluateAllFormulas(input: Letter_grade_to_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.slope * input.gradePoint + input.intercept; results["rawPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["rawPercentage"] = 0; }
  try { const v = Math.min(input.clampMax, Math.max(input.clampMin, (results["rawPercentage"] ?? 0))); results["percentage"] = Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  try { const v = Math.max(0, Math.min(4, Math.floor(((results["percentage"] ?? 0) - 50) / 10))); results["letterGradeNumeric"] = Number.isFinite(v) ? v : 0; } catch { results["letterGradeNumeric"] = 0; }
  return results;
}


export function calculateLetter_grade_to_percentage_calculator(input: Letter_grade_to_percentage_calculatorInput): Letter_grade_to_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentage"] ?? 0;
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


export interface Letter_grade_to_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
