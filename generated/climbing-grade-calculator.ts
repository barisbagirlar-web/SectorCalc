// Auto-generated from climbing-grade-calculator-schema.json
import * as z from 'zod';

export interface Climbing_grade_calculatorInput {
  horizontalDistance: number;
  verticalRise: number;
  angleInput: number;
  slopeLengthInput: number;
}

export const Climbing_grade_calculatorInputSchema = z.object({
  horizontalDistance: z.number().default(100),
  verticalRise: z.number().default(10),
  angleInput: z.number().default(0),
  slopeLengthInput: z.number().default(0),
});

function evaluateAllFormulas(input: Climbing_grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.verticalRise / input.horizontalDistance) * 100; results["gradePercent"] = Number.isFinite(v) ? v : 0; } catch { results["gradePercent"] = 0; }
  try { const v = Math.atan(input.verticalRise / input.horizontalDistance) * (180 / Math.PI); results["angleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["angleDeg"] = 0; }
  try { const v = input.horizontalDistance / input.verticalRise; results["slopeRatioRunToRise"] = Number.isFinite(v) ? v : 0; } catch { results["slopeRatioRunToRise"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.horizontalDistance, 2) + Math.pow(input.verticalRise, 2)); results["slopeLength"] = Number.isFinite(v) ? v : 0; } catch { results["slopeLength"] = 0; }
  return results;
}


export function calculateClimbing_grade_calculator(input: Climbing_grade_calculatorInput): Climbing_grade_calculatorOutput {
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


export interface Climbing_grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
