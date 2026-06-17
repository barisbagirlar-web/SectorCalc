// @ts-nocheck
// Auto-generated from va-loan-calculator-schema.json
import * as z from 'zod';

export interface Va_loan_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  fundingFeeRate: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
}

export const Va_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(400000),
  interestRate: z.number().default(3.5),
  loanTerm: z.number().default(30),
  fundingFeeRate: z.number().default(2.15),
  propertyTaxRate: z.number().default(1.2),
  homeInsuranceAnnual: z.number().default(1200),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Va_loan_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.loanAmount * (1 + input.fundingFeeRate / 100); results["totalLoan"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLoan"] = 0; }
  try { const v = input.interestRate / 12 / 100; results["monthlyInterestRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (input.loanAmount * input.propertyTaxRate / 100) / 12; results["monthlyTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyTax"] = 0; }
  try { const v = input.homeInsuranceAnnual / 12; results["monthlyInsurance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInsurance"] = 0; }
  try { const v = input.loanAmount * input.fundingFeeRate / 100; results["totalFundingFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFundingFee"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVa_loan_calculator(input: Va_loan_calculatorInput): Va_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFundingFee"]);
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


export interface Va_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
