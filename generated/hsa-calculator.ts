// @ts-nocheck
// Auto-generated from hsa-calculator-schema.json
import * as z from 'zod';

export interface Hsa_calculatorInput {
  currentAge: number;
  annualContribution: number;
  initialBalance: number;
  annualInterestRate: number;
  taxRate: number;
  yearsUntilRetirement: number;
  employerContribution: number;
}

export const Hsa_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  annualContribution: z.number().default(3600),
  initialBalance: z.number().default(0),
  annualInterestRate: z.number().default(5),
  taxRate: z.number().default(22),
  yearsUntilRetirement: z.number().default(35),
  employerContribution: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hsa_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.annualContribution + input.employerContribution) * input.yearsUntilRetirement; results["totalContributions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = ((input.annualContribution + input.employerContribution) * input.yearsUntilRetirement) * (input.taxRate/100); results["taxSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxSavings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHsa_calculator(input: Hsa_calculatorInput): Hsa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["taxSavings"]);
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


export interface Hsa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
