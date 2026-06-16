// Auto-generated from sba-loan-calculator-schema.json
import * as z from 'zod';

export interface Sba_loan_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  sbaGuaranteeFee: number;
}

export const Sba_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(100000),
  interestRate: z.number().default(6),
  loanTerm: z.number().default(10),
  sbaGuaranteeFee: z.number().default(3.5),
});

function evaluateAllFormulas(input: Sba_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount * (1 + input.sbaGuaranteeFee / 100); results["totalPrincipal"] = Number.isFinite(v) ? v : 0; } catch { results["totalPrincipal"] = 0; }
  try { const v = input.interestRate / 1200; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numPayments"] = 0; }
  try { const v = ((results["totalPrincipal"] ?? 0) * (results["monthlyRate"] ?? 0) * Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numPayments"] ?? 0))) / (Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numPayments"] ?? 0)) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (results["numPayments"] ?? 0); results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - (results["totalPrincipal"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateSba_loan_calculator(input: Sba_loan_calculatorInput): Sba_loan_calculatorOutput {
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


export interface Sba_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
