// Auto-generated from fha-loan-calculator-schema.json
import * as z from 'zod';

export interface Fha_loan_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxAnnual: number;
  hazardInsuranceAnnual: number;
  mipAnnualRate: number;
}

export const Fha_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(200000),
  interestRate: z.number().default(3.5),
  loanTerm: z.number().default(30),
  propertyTaxAnnual: z.number().default(2400),
  hazardInsuranceAnnual: z.number().default(1000),
  mipAnnualRate: z.number().default(0.85),
});

function evaluateAllFormulas(input: Fha_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loanAmount * ((input.interestRate/100/12) * Math.pow(1 + (input.interestRate/100/12), input.loanTerm*12)) / (Math.pow(1 + (input.interestRate/100/12), input.loanTerm*12) - 1)); results["principalAndInterest"] = Number.isFinite(v) ? v : 0; } catch { results["principalAndInterest"] = 0; }
  try { const v = input.propertyTaxAnnual / 12; results["propertyTaxMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["propertyTaxMonthly"] = 0; }
  try { const v = input.hazardInsuranceAnnual / 12; results["hazardInsuranceMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["hazardInsuranceMonthly"] = 0; }
  try { const v = (input.loanAmount * input.mipAnnualRate / 100) / 12; results["mipMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["mipMonthly"] = 0; }
  try { const v = (results["principalAndInterest"] ?? 0) + (results["propertyTaxMonthly"] ?? 0) + (results["hazardInsuranceMonthly"] ?? 0) + (results["mipMonthly"] ?? 0); results["totalMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyPayment"] = 0; }
  return results;
}


export function calculateFha_loan_calculator(input: Fha_loan_calculatorInput): Fha_loan_calculatorOutput {
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


export interface Fha_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
