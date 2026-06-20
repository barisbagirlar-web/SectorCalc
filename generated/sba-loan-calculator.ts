// Auto-generated from sba-loan-calculator-schema.json
import * as z from 'zod';

export interface Sba_loan_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  sbaGuaranteeFee: number;
  dataConfidence?: number;
}

export const Sba_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(100000),
  interestRate: z.number().default(6),
  loanTerm: z.number().default(10),
  sbaGuaranteeFee: z.number().default(3.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sba_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount * (1 + input.sbaGuaranteeFee / 100); results["totalPrincipal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPrincipal"] = Number.NaN; }
  try { const v = input.interestRate / 1200; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  try { const v = input.loanTerm * 12; results["numPayments"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numPayments"] = Number.NaN; }
  return results;
}


export function calculateSba_loan_calculator(input: Sba_loan_calculatorInput): Sba_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["numPayments"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
