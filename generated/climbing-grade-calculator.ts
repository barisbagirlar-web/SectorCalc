// Auto-generated from climbing-grade-calculator-schema.json
import * as z from 'zod';

export interface Climbing_grade_calculatorInput {
  horizontalDistance: number;
  verticalRise: number;
  angleInput: number;
  slopeLengthInput: number;
  dataConfidence?: number;
}

export const Climbing_grade_calculatorInputSchema = z.object({
  horizontalDistance: z.number().default(100),
  verticalRise: z.number().default(10),
  angleInput: z.number().default(0),
  slopeLengthInput: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Climbing_grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.verticalRise / input.horizontalDistance) * 100; results["gradePercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gradePercent"] = 0; }
  try { const v = input.horizontalDistance / input.verticalRise; results["slopeRatioRunToRise"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["slopeRatioRunToRise"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateClimbing_grade_calculator(input: Climbing_grade_calculatorInput): Climbing_grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gradePercent"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Climbing_grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
