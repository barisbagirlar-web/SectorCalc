// Auto-generated from runs-test-calculator-schema.json
import * as z from 'zod';

export interface Runs_test_calculatorInput {
  countA: number;
  countB: number;
  runs: number;
  alpha: number;
  dataConfidence?: number;
}

export const Runs_test_calculatorInputSchema = z.object({
  countA: z.number(),
  countB: z.number(),
  runs: z.number(),
  alpha: z.number().default(0.05),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Runs_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * input.countA * input.countB) / (input.countA + input.countB) + 1; results["expectedRuns"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedRuns"] = 0; }
  try { const v = (2 * input.countA * input.countB) / (input.countA + input.countB) + 1; results["expectedRuns_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedRuns_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRuns_test_calculator(input: Runs_test_calculatorInput): Runs_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedRuns_aux"]);
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


export interface Runs_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
