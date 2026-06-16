// Auto-generated from cash-out-refinance-calculator-schema.json
import * as z from 'zod';

export interface Cash_out_refinance_calculatorInput {
  propertyValue: number;
  existingMortgageBalance: number;
  cashOutAmount: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
}

export const Cash_out_refinance_calculatorInputSchema = z.object({
  propertyValue: z.number().default(300000),
  existingMortgageBalance: z.number().default(200000),
  cashOutAmount: z.number().default(50000),
  interestRate: z.number().default(5),
  loanTerm: z.number().default(30),
  closingCosts: z.number().default(5000),
});

function evaluateAllFormulas(input: Cash_out_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.existingMortgageBalance + input.cashOutAmount + input.closingCosts; results["newLoanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["newLoanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (results["newLoanAmount"] ?? 0) * (results["monthlyInterestRate"] ?? 0) * ((1 + (results["monthlyInterestRate"] ?? 0)) ** (results["numberOfPayments"] ?? 0)) / (((1 + (results["monthlyInterestRate"] ?? 0)) ** (results["numberOfPayments"] ?? 0)) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (results["numberOfPayments"] ?? 0); results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - (results["newLoanAmount"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = ((results["newLoanAmount"] ?? 0) / input.propertyValue) * 100; results["loanToValue"] = Number.isFinite(v) ? v : 0; } catch { results["loanToValue"] = 0; }
  return results;
}


export function calculateCash_out_refinance_calculator(input: Cash_out_refinance_calculatorInput): Cash_out_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPayment"] ?? 0;
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


export interface Cash_out_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
