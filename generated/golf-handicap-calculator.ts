// @ts-nocheck
// Auto-generated from golf-handicap-calculator-schema.json
import * as z from 'zod';

export interface Golf_handicap_calculatorInput {
  grossScore: number;
  courseRating: number;
  slopeRating: number;
  par: number;
  handicapIndex: number;
}

export const Golf_handicap_calculatorInputSchema = z.object({
  grossScore: z.number().default(85),
  courseRating: z.number().default(72),
  slopeRating: z.number().default(113),
  par: z.number().default(72),
  handicapIndex: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Golf_handicap_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.grossScore - input.courseRating) * 113 / input.slopeRating; results["differential"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["differential"] = 0; }
  try { const v = input.handicapIndex * (input.slopeRating / 113) + (input.courseRating - input.par); results["courseHandicap"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["courseHandicap"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGolf_handicap_calculator(input: Golf_handicap_calculatorInput): Golf_handicap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["differential"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Golf_handicap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
