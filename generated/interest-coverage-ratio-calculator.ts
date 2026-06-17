// @ts-nocheck
// Auto-generated from interest-coverage-ratio-calculator-schema.json
import * as z from 'zod';

export interface Interest_coverage_ratio_calculatorInput {
  ebit: number;
  interestExpense: number;
  ebitda: number;
  depreciation: number;
}

export const Interest_coverage_ratio_calculatorInputSchema = z.object({
  ebit: z.number().default(100000),
  interestExpense: z.number().default(20000),
  ebitda: z.number().default(120000),
  depreciation: z.number().default(20000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Interest_coverage_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.ebit / input.interestExpense; results["interestCoverageRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["interestCoverageRatio"] = 0; }
  try { const v = input.ebitda / input.interestExpense; results["ebitdaCoverageRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ebitdaCoverageRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInterest_coverage_ratio_calculator(input: Interest_coverage_ratio_calculatorInput): Interest_coverage_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["interestCoverageRatio"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Interest_coverage_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
