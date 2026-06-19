// Auto-generated from triple-test-calculator-schema.json
import * as z from 'zod';

export interface Triple_test_calculatorInput {
  s1: number;
  s2: number;
  s3: number;
  target: number;
  cv_limit: number;
  min_individual: number;
  max_individual: number;
  dataConfidence?: number;
}

export const Triple_test_calculatorInputSchema = z.object({
  s1: z.number().default(30),
  s2: z.number().default(32),
  s3: z.number().default(31),
  target: z.number().default(30),
  cv_limit: z.number().default(10),
  min_individual: z.number().default(25),
  max_individual: z.number().default(45),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Triple_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.s1 + input.s2 + input.s3) / 3; results["mean"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = ((input.s1 + input.s2 + input.s3) / 3) >= input.target; results["mean_ok"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mean_ok"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTriple_test_calculator(input: Triple_test_calculatorInput): Triple_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mean_ok"]);
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


export interface Triple_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
