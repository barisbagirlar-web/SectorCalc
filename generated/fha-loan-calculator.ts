// Auto-generated from fha-loan-calculator-schema.json
import * as z from 'zod';

export interface Fha_loan_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxAnnual: number;
  hazardInsuranceAnnual: number;
  mipAnnualRate: number;
  dataConfidence?: number;
}

export const Fha_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(200000),
  interestRate: z.number().default(3.5),
  loanTerm: z.number().default(30),
  propertyTaxAnnual: z.number().default(2400),
  hazardInsuranceAnnual: z.number().default(1000),
  mipAnnualRate: z.number().default(0.85),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fha_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyTaxAnnual / 12; results["propertyTaxMonthly"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["propertyTaxMonthly"] = 0; }
  try { const v = input.hazardInsuranceAnnual / 12; results["hazardInsuranceMonthly"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hazardInsuranceMonthly"] = 0; }
  try { const v = (input.loanAmount * input.mipAnnualRate / 100) / 12; results["mipMonthly"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mipMonthly"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFha_loan_calculator(input: Fha_loan_calculatorInput): Fha_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["mipMonthly"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
