// Auto-generated from loan-payment-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LoanPaymentCalculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermMonths: number;
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
  extraPayment: number;
  compoundFrequency: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
}

export const LoanPaymentCalculatorInputSchema = z.object({
  loanAmount: z.number().min(0).default(100000),
  annualInterestRate: z.number().min(0).max(100).default(5),
  loanTermMonths: z.number().min(1).max(480).default(60),
  paymentFrequency: z.enum(['monthly', 'biweekly', 'weekly']).default('monthly'),
  extraPayment: z.number().min(0).default(0),
  compoundFrequency: z.enum(['monthly', 'quarterly', 'semi-annually', 'annually']).default('monthly'),
});

export interface LoanPaymentCalculatorOutput {
  paymentPerPeriod: number;
  breakdown: {
    totalPayment: number;
    totalInterest: number;
    effectiveAnnualRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LoanPaymentCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.periodicInterestRate = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.numberOfPayments = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paymentPerPeriod = ((): number => { try { const __v = (input.loanAmount * results.periodicInterestRate * (1 + results.periodicInterestRate)^results.numberOfPayments) / ((1 + results.periodicInterestRate)^results.numberOfPayments - 1) + input.extraPayment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalPayment = ((): number => { try { const __v = results.paymentPerPeriod * results.numberOfPayments; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalInterest = ((): number => { try { const __v = results.totalPayment - input.loanAmount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveAnnualRate = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLoanPaymentCalculator(input: LoanPaymentCalculatorInput): LoanPaymentCalculatorOutput {
  const results = evaluateFormulas(input);
  const paymentPerPeriod = results.paymentPerPeriod ?? 0;
  const breakdown = {
    totalPayment: results.totalPayment,
    totalInterest: results.totalInterest,
    effectiveAnnualRate: results.effectiveAnnualRate,
  };

  // rule: loanAmount > 0
  // rule: annualInterestRate >= 0
  // rule: loanTermMonths >= 1
  // rule: extraPayment >= 0
  // rule: if paymentFrequency == 'biweekly' then loanTermMonths must be multiple of 0.5? (not enforced, but term in months is approximate)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High interest rate warning
  // threshold skipped (non-JS): Very long loan term
  // threshold skipped (non-JS): Extra payment exceeds 10% of loan amount

  const dataConfidenceAdjusted = (() => { try { return paymentPerPeriod; } catch { return paymentPerPeriod; } })();

  return {
    paymentPerPeriod,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with other loan options","Detailed Amortization Schedule"],
  };
}
