// Auto-generated from golf-course-handicap-calculator-schema.json
import * as z from 'zod';

export interface Golf_course_handicap_calculatorInput {
  adjustedGrossScore: number;
  courseRating: number;
  slopeRating: number;
  par: number;
  handicapIndex: number;
}

export const Golf_course_handicap_calculatorInputSchema = z.object({
  adjustedGrossScore: z.number().default(85),
  courseRating: z.number().default(72),
  slopeRating: z.number().default(130),
  par: z.number().default(72),
  handicapIndex: z.number().default(10),
});

function evaluateAllFormulas(input: Golf_course_handicap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.adjustedGrossScore - input.courseRating) * 113 / input.slopeRating; results["handicapDifferential"] = Number.isFinite(v) ? v : 0; } catch { results["handicapDifferential"] = 0; }
  try { const v = input.handicapIndex * (input.slopeRating / 113) + (input.courseRating - input.par); results["courseHandicap"] = Number.isFinite(v) ? v : 0; } catch { results["courseHandicap"] = 0; }
  return results;
}


export function calculateGolf_course_handicap_calculator(input: Golf_course_handicap_calculatorInput): Golf_course_handicap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["handicapDifferential"] ?? 0;
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


export interface Golf_course_handicap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
