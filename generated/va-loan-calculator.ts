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

function evaluateAllFormulas(input: Va_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount * (1 + input.fundingFeeRate / 100); results["totalLoan"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoan"] = 0; }
  try { const v = input.interestRate / 12 / 100; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = ((results["totalLoan"] ?? 0) * (results["monthlyInterestRate"] ?? 0)) / (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -(results["numberOfPayments"] ?? 0))); results["monthlyPI"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPI"] = 0; }
  try { const v = (input.loanAmount * input.propertyTaxRate / 100) / 12; results["monthlyTax"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyTax"] = 0; }
  try { const v = input.homeInsuranceAnnual / 12; results["monthlyInsurance"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInsurance"] = 0; }
  try { const v = (results["monthlyPI"] ?? 0) + (results["monthlyTax"] ?? 0) + (results["monthlyInsurance"] ?? 0); results["totalMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyPayment"] = 0; }
  try { const v = ((results["monthlyPI"] ?? 0) * (results["numberOfPayments"] ?? 0)) - (results["totalLoan"] ?? 0); results["totalInterestPaid"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestPaid"] = 0; }
  try { const v = input.loanAmount * input.fundingFeeRate / 100; results["totalFundingFee"] = Number.isFinite(v) ? v : 0; } catch { results["totalFundingFee"] = 0; }
  return results;
}


export function calculateVa_loan_calculator(input: Va_loan_calculatorInput): Va_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMonthlyPayment"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
