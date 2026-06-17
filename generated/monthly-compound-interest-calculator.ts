// @ts-nocheck
// Auto-generated from monthly-compound-interest-calculator-schema.json
import * as z from 'zod';

export interface Monthly_compound_interest_calculatorInput {
  principal: number;
  annualInterestRate: number;
  years: number;
  monthlyContribution: number;
}

export const Monthly_compound_interest_calculatorInputSchema = z.object({
  principal: z.number().default(10000),
  annualInterestRate: z.number().default(5),
  years: z.number().default(5),
  monthlyContribution: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Monthly_compound_interest_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.principal + input.monthlyContribution * input.years * 12; results["totalContributions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = input.principal + input.monthlyContribution * input.years * 12; results["totalContributions_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalContributions_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMonthly_compound_interest_calculator(input: Monthly_compound_interest_calculatorInput): Monthly_compound_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalContributions_aux"]);
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


export interface Monthly_compound_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
