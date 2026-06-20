// Auto-generated from percentage-to-letter-grade-calculator-schema.json
import * as z from 'zod';

export interface Percentage_to_letter_grade_calculatorInput {
  percentage: number;
  aMin: number;
  bMin: number;
  cMin: number;
  dMin: number;
  dataConfidence?: number;
}

export const Percentage_to_letter_grade_calculatorInputSchema = z.object({
  percentage: z.number().default(85),
  aMin: z.number().default(90),
  bMin: z.number().default(80),
  cMin: z.number().default(70),
  dMin: z.number().default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percentage_to_letter_grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 'A: ≥' + input.aMin + '%'; results["scaleA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaleA"] = Number.NaN; }
  try { const v = 'B: ≥' + input.bMin + '%'; results["scaleB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaleB"] = Number.NaN; }
  try { const v = 'C: ≥' + input.cMin + '%'; results["scaleC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaleC"] = Number.NaN; }
  try { const v = 'D: ≥' + input.dMin + '%'; results["scaleD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaleD"] = Number.NaN; }
  try { const v = 'F: <' + input.dMin + '%'; results["scaleF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaleF"] = Number.NaN; }
  return results;
}


export function calculatePercentage_to_letter_grade_calculator(input: Percentage_to_letter_grade_calculatorInput): Percentage_to_letter_grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["scaleF"]);
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


export interface Percentage_to_letter_grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
