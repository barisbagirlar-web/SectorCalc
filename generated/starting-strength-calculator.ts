// Auto-generated from starting-strength-calculator-schema.json
import * as z from 'zod';

export interface Starting_strength_calculatorInput {
  weight: number;
  reps: number;
  startingPercentage: number;
  bodyweight: number;
  dataConfidence?: number;
}

export const Starting_strength_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
  startingPercentage: z.number().default(80),
  bodyweight: z.number().default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Starting_strength_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps/30); results["estimated1RM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimated1RM"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["estimated1RM"])) * (input.startingPercentage/100); results["startingWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["startingWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["startingWeight"])) / input.bodyweight; results["weightRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightRatio"] = Number.NaN; }
  return results;
}


export function calculateStarting_strength_calculator(input: Starting_strength_calculatorInput): Starting_strength_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["startingWeight"]);
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


export interface Starting_strength_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
