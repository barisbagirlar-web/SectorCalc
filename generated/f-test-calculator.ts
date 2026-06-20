// Auto-generated from f-test-calculator-schema.json
import * as z from 'zod';

export interface F_test_calculatorInput {
  ss1: number;
  df1: number;
  ss2: number;
  df2: number;
  dataConfidence?: number;
}

export const F_test_calculatorInputSchema = z.object({
  ss1: z.number().default(0),
  df1: z.number().default(1),
  ss2: z.number().default(0),
  df2: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: F_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ss1 / input.df1; results["ms1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ms1"] = Number.NaN; }
  try { const v = input.ss2 / input.df2; results["ms2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ms2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ms1"])) / (toNumericFormulaValue(results["ms2"])); results["f_statistic"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["f_statistic"] = Number.NaN; }
  return results;
}


export function calculateF_test_calculator(input: F_test_calculatorInput): F_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["f_statistic"]);
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


export interface F_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
