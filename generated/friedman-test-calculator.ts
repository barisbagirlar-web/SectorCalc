// Auto-generated from friedman-test-calculator-schema.json
import * as z from 'zod';

export interface Friedman_test_calculatorInput {
  k: number;
  n: number;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
  R5: number;
  R6: number;
  dataConfidence?: number;
}

export const Friedman_test_calculatorInputSchema = z.object({
  k: z.number().default(3),
  n: z.number().default(5),
  R1: z.number().default(7),
  R2: z.number().default(12),
  R3: z.number().default(11),
  R4: z.number().default(0),
  R5: z.number().default(0),
  R6: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Friedman_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.R1**2 + input.R2**2 + input.R3**2 + input.R4**2 + input.R5**2 + input.R6**2; results["sumSquaredRanks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sumSquaredRanks"] = Number.NaN; }
  try { const v = 12/(input.n*input.k*(input.k+1)) * (input.R1**2 + input.R2**2 + input.R3**2 + input.R4**2 + input.R5**2 + input.R6**2) - 3*input.n*(input.k+1); results["friedmanStatistic"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["friedmanStatistic"] = Number.NaN; }
  try { const v = input.k - 1; results["degreesOfFreedom"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["degreesOfFreedom"] = Number.NaN; }
  try { const v = input.n*(input.k+1)/2; results["expectedMeanRank"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedMeanRank"] = Number.NaN; }
  return results;
}


export function calculateFriedman_test_calculator(input: Friedman_test_calculatorInput): Friedman_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["friedmanStatistic"]);
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


export interface Friedman_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
