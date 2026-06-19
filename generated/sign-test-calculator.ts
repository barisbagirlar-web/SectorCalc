// Auto-generated from sign-test-calculator-schema.json
import * as z from 'zod';

export interface Sign_test_calculatorInput {
  sampleSize: number;
  posCount: number;
  p0: number;
  alpha: number;
  testType: number;
  dataConfidence?: number;
}

export const Sign_test_calculatorInputSchema = z.object({
  sampleSize: z.number().default(20),
  posCount: z.number().default(10),
  p0: z.number().default(0.5),
  alpha: z.number().default(0.05),
  testType: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sign_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sampleSize) * (input.posCount) * (input.p0) * (input.alpha) * (input.testType); results["expected"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expected"] = 0; }
  try { const v = (input.sampleSize) * (input.posCount) * (input.p0); results["expected_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expected_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSign_test_calculator(input: Sign_test_calculatorInput): Sign_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["expected_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Sign_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
