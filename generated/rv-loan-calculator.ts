// @ts-nocheck
// Auto-generated from rv-loan-calculator-schema.json
import * as z from 'zod';

export interface Rv_loan_calculatorInput {
  rvPrice: number;
  downPayment: number;
  tradeInValue: number;
  annualInterestRate: number;
  loanTerm: number;
  salesTaxRate: number;
}

export const Rv_loan_calculatorInputSchema = z.object({
  rvPrice: z.number().default(50000),
  downPayment: z.number().default(10000),
  tradeInValue: z.number().default(0),
  annualInterestRate: z.number().default(5.5),
  loanTerm: z.number().default(60),
  salesTaxRate: z.number().default(8),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rv_loan_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.rvPrice * (1 + input.salesTaxRate/100) - input.downPayment - input.tradeInValue; results["amountFinanced"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["amountFinanced"] = 0; }
  try { const v = input.annualInterestRate / 1200; results["monthlyInterestRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRv_loan_calculator(input: Rv_loan_calculatorInput): Rv_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyInterestRate"]);
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


export interface Rv_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
