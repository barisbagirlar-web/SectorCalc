// Auto-generated from progression-calculator-schema.json
import * as z from 'zod';

export interface Progression_calculatorInput {
  firstTerm: number;
  commonDifference: number;
  startIndex: number;
  endIndex: number;
  dataConfidence?: number;
}

export const Progression_calculatorInputSchema = z.object({
  firstTerm: z.number().default(1),
  commonDifference: z.number().default(1),
  startIndex: z.number().default(1),
  endIndex: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Progression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.endIndex - input.startIndex + 1) * (2 * input.firstTerm + input.commonDifference * (input.startIndex + input.endIndex - 2))) / 2; results["sum"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sum"] = Number.NaN; }
  try { const v = input.firstTerm + input.commonDifference * (input.startIndex - 1); results["startValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["startValue"] = Number.NaN; }
  try { const v = input.firstTerm + input.commonDifference * (input.endIndex - 1); results["endValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["endValue"] = Number.NaN; }
  return results;
}


export function calculateProgression_calculator(input: Progression_calculatorInput): Progression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sum"]);
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


export interface Progression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
