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

function evaluateAllFormulas(input: Rv_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rvPrice * (1 + input.salesTaxRate/100) - input.downPayment - input.tradeInValue; results["amountFinanced"] = Number.isFinite(v) ? v : 0; } catch { results["amountFinanced"] = 0; }
  try { const v = input.annualInterestRate / 1200; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = (results["monthlyInterestRate"] ?? 0) === 0 ? (results["amountFinanced"] ?? 0) / input.loanTerm : (results["amountFinanced"] ?? 0) * (results["monthlyInterestRate"] ?? 0) / (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -input.loanTerm)); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.loanTerm - (results["amountFinanced"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.loanTerm + input.downPayment + input.tradeInValue; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateRv_loan_calculator(input: Rv_loan_calculatorInput): Rv_loan_calculatorOutput {
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


export interface Rv_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
