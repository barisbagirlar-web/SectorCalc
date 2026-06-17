// @ts-nocheck
// Auto-generated from apr-calculator-schema.json
import * as z from 'zod';

export interface Apr_calculatorInput {
  loanAmount: number;
  nominalRate: number;
  loanTermYears: number;
  compoundingFrequency: number;
  fees: number;
}

export const Apr_calculatorInputSchema = z.object({
  loanAmount: z.number().default(10000),
  nominalRate: z.number().default(5),
  loanTermYears: z.number().default(5),
  compoundingFrequency: z.number().default(12),
  fees: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Apr_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.loanAmount + input.nominalRate + input.loanTermYears; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.loanAmount + input.nominalRate + input.loanTermYears; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateApr_calculator(input: Apr_calculatorInput): Apr_calculatorOutput {
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


export interface Apr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
