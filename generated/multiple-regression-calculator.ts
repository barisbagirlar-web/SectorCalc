// Auto-generated from multiple-regression-calculator-schema.json
import * as z from 'zod';

export interface Multiple_regression_calculatorInput {
  intercept: number;
  slope1: number;
  slope2: number;
  slope3: number;
  x1: number;
  x2: number;
  x3: number;
  dataConfidence?: number;
}

export const Multiple_regression_calculatorInputSchema = z.object({
  intercept: z.number().default(0),
  slope1: z.number().default(0),
  slope2: z.number().default(0),
  slope3: z.number().default(0),
  x1: z.number().default(0),
  x2: z.number().default(0),
  x3: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Multiple_regression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.intercept + input.slope1 * input.x1 + input.slope2 * input.x2 + input.slope3 * input.x3; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = input.intercept; results["interceptContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["interceptContribution"] = Number.NaN; }
  try { const v = input.slope1 * input.x1; results["var1Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["var1Contribution"] = Number.NaN; }
  try { const v = input.slope2 * input.x2; results["var2Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["var2Contribution"] = Number.NaN; }
  try { const v = input.slope3 * input.x3; results["var3Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["var3Contribution"] = Number.NaN; }
  return results;
}


export function calculateMultiple_regression_calculator(input: Multiple_regression_calculatorInput): Multiple_regression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Multiple_regression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
