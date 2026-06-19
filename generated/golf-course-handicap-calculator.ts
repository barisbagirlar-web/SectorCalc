// Auto-generated from golf-course-handicap-calculator-schema.json
import * as z from 'zod';

export interface Golf_course_handicap_calculatorInput {
  adjustedGrossScore: number;
  courseRating: number;
  slopeRating: number;
  par: number;
  handicapIndex: number;
  dataConfidence?: number;
}

export const Golf_course_handicap_calculatorInputSchema = z.object({
  adjustedGrossScore: z.number().default(85),
  courseRating: z.number().default(72),
  slopeRating: z.number().default(130),
  par: z.number().default(72),
  handicapIndex: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Golf_course_handicap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.adjustedGrossScore - input.courseRating) * 113 / input.slopeRating; results["handicapDifferential"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["handicapDifferential"] = 0; }
  try { const v = input.handicapIndex * (input.slopeRating / 113) + (input.courseRating - input.par); results["courseHandicap"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["courseHandicap"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGolf_course_handicap_calculator(input: Golf_course_handicap_calculatorInput): Golf_course_handicap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["handicapDifferential"]));
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


export interface Golf_course_handicap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
