// @ts-nocheck
// Auto-generated from 401k-retirement-calculator-schema.json
import * as z from 'zod';

export interface _401k_retirement_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualContribution: number;
  employerMatchRate: number;
  annualReturnRate: number;
}

export const _401k_retirement_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentBalance: z.number().default(50000),
  annualContribution: z.number().default(10000),
  employerMatchRate: z.number().default(5),
  annualReturnRate: z.number().default(7),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _401k_retirement_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentAge + input.retirementAge + input.currentBalance; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.currentAge + input.retirementAge + input.currentBalance; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_401k_retirement_calculator(input: _401k_retirement_calculatorInput): _401k_retirement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface _401k_retirement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
