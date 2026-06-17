// Auto-generated from percentage-to-letter-grade-calculator-schema.json
import * as z from 'zod';

export interface Percentage_to_letter_grade_calculatorInput {
  percentage: number;
  aMin: number;
  bMin: number;
  cMin: number;
  dMin: number;
}

export const Percentage_to_letter_grade_calculatorInputSchema = z.object({
  percentage: z.number().default(85),
  aMin: z.number().default(90),
  bMin: z.number().default(80),
  cMin: z.number().default(70),
  dMin: z.number().default(60),
});

function evaluateAllFormulas(input: Percentage_to_letter_grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.percentage >= input.aMin ? 'A' : input.percentage >= input.bMin ? 'B' : input.percentage >= input.cMin ? 'C' : input.percentage >= input.dMin ? 'D' : 'F'; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = 'A: ≥' + input.aMin + '%'; results["scaleA"] = Number.isFinite(v) ? v : 0; } catch { results["scaleA"] = 0; }
  try { const v = 'B: ≥' + input.bMin + '%'; results["scaleB"] = Number.isFinite(v) ? v : 0; } catch { results["scaleB"] = 0; }
  try { const v = 'C: ≥' + input.cMin + '%'; results["scaleC"] = Number.isFinite(v) ? v : 0; } catch { results["scaleC"] = 0; }
  try { const v = 'D: ≥' + input.dMin + '%'; results["scaleD"] = Number.isFinite(v) ? v : 0; } catch { results["scaleD"] = 0; }
  try { const v = 'F: <' + input.dMin + '%'; results["scaleF"] = Number.isFinite(v) ? v : 0; } catch { results["scaleF"] = 0; }
  return results;
}


export function calculatePercentage_to_letter_grade_calculator(input: Percentage_to_letter_grade_calculatorInput): Percentage_to_letter_grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Percentage_to_letter_grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
