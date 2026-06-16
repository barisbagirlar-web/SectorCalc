// Auto-generated from usda-loan-calculator-schema.json
import * as z from 'zod';

export interface Usda_loan_calculatorInput {
  baseLoanAmount: number;
  interestRate: number;
  loanTermYears: number;
  upfrontFeePercent: number;
  annualFeePercent: number;
  annualPropertyTax: number;
  annualHomeInsurance: number;
}

export const Usda_loan_calculatorInputSchema = z.object({
  baseLoanAmount: z.number().default(200000),
  interestRate: z.number().default(3.5),
  loanTermYears: z.number().default(30),
  upfrontFeePercent: z.number().default(1),
  annualFeePercent: z.number().default(0.35),
  annualPropertyTax: z.number().default(2400),
  annualHomeInsurance: z.number().default(1200),
});

function evaluateAllFormulas(input: Usda_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseLoanAmount * input.upfrontFeePercent / 100; results["upfrontFeeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["upfrontFeeAmount"] = 0; }
  try { const v = input.baseLoanAmount + (results["upfrontFeeAmount"] ?? 0); results["totalLoanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoanAmount"] = 0; }
  try { const v = (input.interestRate / 100) / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (results["totalLoanAmount"] ?? 0) * (results["monthlyInterestRate"] ?? 0) * (1 + (results["monthlyInterestRate"] ?? 0)) ** (results["numberOfPayments"] ?? 0) / ((1 + (results["monthlyInterestRate"] ?? 0)) ** (results["numberOfPayments"] ?? 0) - 1); results["monthlyPI"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPI"] = 0; }
  try { const v = input.annualPropertyTax / 12; results["monthlyTax"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyTax"] = 0; }
  try { const v = input.annualHomeInsurance / 12; results["monthlyInsurance"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInsurance"] = 0; }
  try { const v = (input.baseLoanAmount * input.annualFeePercent / 100) / 12; results["monthlyAnnualFee"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyAnnualFee"] = 0; }
  try { const v = (results["monthlyPI"] ?? 0) + (results["monthlyTax"] ?? 0) + (results["monthlyInsurance"] ?? 0) + (results["monthlyAnnualFee"] ?? 0); results["totalMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyPayment"] = 0; }
  return results;
}


export function calculateUsda_loan_calculator(input: Usda_loan_calculatorInput): Usda_loan_calculatorOutput {
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


export interface Usda_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
