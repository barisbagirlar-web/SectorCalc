// Auto-generated from mortgage-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MortgageCalculatorInput {
  homePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  propertyTaxRate: number;
  homeInsuranceRate: number;
  pmiRate: number;
  hoaDues: number;
  otherMonthlyCosts: number;
  annualIncome: number;
  monthlyDebts: number;
}

export const MortgageCalculatorInputSchema = z.object({
  homePrice: z.number().min(10000).max(10000000).default(300000),
  downPayment: z.number().min(0).max(10000000).default(60000),
  loanTerm: z.number().min(1).max(40).default(30),
  interestRate: z.number().min(0.1).max(20).default(4.5),
  propertyTaxRate: z.number().min(0).max(5).default(1.2),
  homeInsuranceRate: z.number().min(0).max(3).default(0.5),
  pmiRate: z.number().min(0).max(2).default(0.8),
  hoaDues: z.number().min(0).max(5000).default(0),
  otherMonthlyCosts: z.number().min(0).max(10000).default(0),
  annualIncome: z.number().min(0).max(10000000).default(100000),
  monthlyDebts: z.number().min(0).max(100000).default(500),
});

export interface MortgageCalculatorOutput {
  totalMonthlyPayment: number;
  breakdown: {
    monthlyPrincipalAndInterest: number;
    monthlyPropertyTax: number;
    monthlyHomeInsurance: number;
    monthlyPMI: number;
    hoaDues: number;
    otherMonthlyCosts: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MortgageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.loanAmount = ((): number => { try { const __v = input.homePrice - input.downPayment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyInterestRate = ((): number => { try { const __v = input.interestRate / 100 / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.numberOfPayments = ((): number => { try { const __v = input.loanTerm * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyPrincipalAndInterest = ((): number => { try { const __v = results.loanAmount * results.monthlyInterestRate * Math.Math.pow(1 + results.monthlyInterestRate, results.numberOfPayments) / (Math.Math.pow(1 + results.monthlyInterestRate, results.numberOfPayments) - 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyPropertyTax = ((): number => { try { const __v = input.homePrice * (input.propertyTaxRate / 100) / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyHomeInsurance = ((): number => { try { const __v = input.homePrice * (input.homeInsuranceRate / 100) / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyPMI = ((): number => { try { const __v = input.downPayment < input.homePrice * 0.2 ? (results.loanAmount * (input.pmiRate / 100) / 12) : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMonthlyPayment = ((): number => { try { const __v = results.monthlyPrincipalAndInterest + results.monthlyPropertyTax + results.monthlyHomeInsurance + results.monthlyPMI + input.hoaDues + input.otherMonthlyCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.debtToIncomeRatio = ((): number => { try { const __v = (results.totalMonthlyPayment + input.monthlyDebts) / (input.annualIncome / 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.loanToValueRatio = ((): number => { try { const __v = results.loanAmount / input.homePrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalInterestPaid = ((): number => { try { const __v = results.monthlyPrincipalAndInterest * results.numberOfPayments - results.loanAmount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = input.downPayment + results.monthlyPrincipalAndInterest * results.numberOfPayments + results.monthlyPropertyTax * results.numberOfPayments + results.monthlyHomeInsurance * results.numberOfPayments + results.monthlyPMI * results.numberOfPayments + input.hoaDues * results.numberOfPayments + input.otherMonthlyCosts * results.numberOfPayments; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMortgageCalculator(input: MortgageCalculatorInput): MortgageCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalMonthlyPayment = results.totalMonthlyPayment ?? 0;
  const breakdown = {
    monthlyPrincipalAndInterest: results.monthlyPrincipalAndInterest,
    monthlyPropertyTax: results.monthlyPropertyTax,
    monthlyHomeInsurance: results.monthlyHomeInsurance,
    monthlyPMI: results.monthlyPMI,
    hoaDues: results.hoaDues,
    otherMonthlyCosts: results.otherMonthlyCosts,
  };

  // rule: downPayment < homePrice * 0.2 => pmiRate > 0
  // rule: downPayment >= homePrice => loanTerm = 0
  // rule: interestRate > 0
  // rule: loanTerm > 0
  // rule: homePrice > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High DTI ratio; loan may be denied.
  // threshold skipped (non-JS): PMI required.
  // threshold skipped (non-JS): Housing expense ratio exceeds 28%.

  const dataConfidenceAdjusted = (() => { try { return results.totalMonthlyPayment; } catch { return totalMonthlyPayment; } })();

  return {
    totalMonthlyPayment,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with other scenarios","Detailed Amortization Schedule"],
  };
}
