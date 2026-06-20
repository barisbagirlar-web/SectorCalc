// Auto-generated from grade-calculator-schema.json
import * as z from 'zod';

export interface Grade_calculatorInput {
  initialElevation: number;
  finalElevation: number;
  horizontalDistance: number;
  roundDecimals: number;
  dataConfidence?: number;
}

export const Grade_calculatorInputSchema = z.object({
  initialElevation: z.number().default(100),
  finalElevation: z.number().default(105),
  horizontalDistance: z.number().default(1000),
  roundDecimals: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.finalElevation - input.initialElevation) / input.horizontalDistance) * 100; results["gradePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gradePercent"] = Number.NaN; }
  try { const v = input.horizontalDistance / (input.finalElevation - input.initialElevation); results["slopeRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["slopeRatio"] = Number.NaN; }
  return results;
}


export function calculateGrade_calculator(input: Grade_calculatorInput): Grade_calculatorOutput {
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


export interface Grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
