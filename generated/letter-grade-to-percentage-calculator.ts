// Auto-generated from letter-grade-to-percentage-calculator-schema.json
import * as z from 'zod';

export interface Letter_grade_to_percentage_calculatorInput {
  gradePoint: number;
  slope: number;
  intercept: number;
  clampMin: number;
  clampMax: number;
  dataConfidence?: number;
}

export const Letter_grade_to_percentage_calculatorInputSchema = z.object({
  gradePoint: z.number().default(4),
  slope: z.number().default(10),
  intercept: z.number().default(55),
  clampMin: z.number().default(0),
  clampMax: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Letter_grade_to_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.slope * input.gradePoint + input.intercept; results["rawPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawPercentage"] = 0; }
  try { const v = input.slope * input.gradePoint + input.intercept; results["rawPercentage_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawPercentage_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLetter_grade_to_percentage_calculator(input: Letter_grade_to_percentage_calculatorInput): Letter_grade_to_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rawPercentage_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
