// Auto-generated from grade-calculator-schema.json
import * as z from 'zod';

export interface Grade_calculatorInput {
  initialElevation: number;
  finalElevation: number;
  horizontalDistance: number;
  roundDecimals: number;
}

export const Grade_calculatorInputSchema = z.object({
  initialElevation: z.number().default(100),
  finalElevation: z.number().default(105),
  horizontalDistance: z.number().default(1000),
  roundDecimals: z.number().default(2),
});

function evaluateAllFormulas(input: Grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.finalElevation - input.initialElevation) / input.horizontalDistance) * 100; results["gradePercent"] = Number.isFinite(v) ? v : 0; } catch { results["gradePercent"] = 0; }
  try { const v = input.horizontalDistance / (input.finalElevation - input.initialElevation); results["slopeRatio"] = Number.isFinite(v) ? v : 0; } catch { results["slopeRatio"] = 0; }
  return results;
}


export function calculateGrade_calculator(input: Grade_calculatorInput): Grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gradePercent"] ?? 0;
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


export interface Grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
