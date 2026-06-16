// Auto-generated from jumbo-loan-calculator-schema.json
import * as z from 'zod';

export interface Jumbo_loan_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  downPaymentPercent: number;
  propertyTaxRate: number;
  annualHomeInsurance: number;
}

export const Jumbo_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(800000),
  annualInterestRate: z.number().default(4),
  loanTermYears: z.number().default(30),
  downPaymentPercent: z.number().default(20),
  propertyTaxRate: z.number().default(1.2),
  annualHomeInsurance: z.number().default(1500),
});

function evaluateAllFormulas(input: Jumbo_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount / (1 - input.downPaymentPercent / 100); results["purchasePrice"] = Number.isFinite(v) ? v : 0; } catch { results["purchasePrice"] = 0; }
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = input.loanAmount * ((results["monthlyRate"] ?? 0) * Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numberOfPayments"] ?? 0))) / (Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numberOfPayments"] ?? 0)) - 1); results["monthlyPI"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPI"] = 0; }
  try { const v = (results["purchasePrice"] ?? 0) * (input.propertyTaxRate / 100) / 12; results["monthlyPropertyTax"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPropertyTax"] = 0; }
  try { const v = input.annualHomeInsurance / 12; results["monthlyInsurance"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInsurance"] = 0; }
  try { const v = (results["monthlyPI"] ?? 0) + (results["monthlyPropertyTax"] ?? 0) + (results["monthlyInsurance"] ?? 0); results["monthlyPITI"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPITI"] = 0; }
  try { const v = (results["monthlyPI"] ?? 0) * (results["numberOfPayments"] ?? 0) - input.loanAmount; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (input.loanAmount / (results["purchasePrice"] ?? 0)) * 100; results["loanToValue"] = Number.isFinite(v) ? v : 0; } catch { results["loanToValue"] = 0; }
  try { const v = (results["monthlyPI"] ?? 0) * (results["numberOfPayments"] ?? 0); results["totalPaymentsPI"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaymentsPI"] = 0; }
  return results;
}


export function calculateJumbo_loan_calculator(input: Jumbo_loan_calculatorInput): Jumbo_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPITI"] ?? 0;
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


export interface Jumbo_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
