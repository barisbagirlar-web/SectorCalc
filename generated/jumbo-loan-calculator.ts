// Auto-generated from jumbo-loan-calculator-schema.json
import * as z from 'zod';

export interface Jumbo_loan_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  downPaymentPercent: number;
  propertyTaxRate: number;
  annualHomeInsurance: number;
  dataConfidence?: number;
}

export const Jumbo_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(800000),
  annualInterestRate: z.number().default(4),
  loanTermYears: z.number().default(30),
  downPaymentPercent: z.number().default(20),
  propertyTaxRate: z.number().default(1.2),
  annualHomeInsurance: z.number().default(1500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Jumbo_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount / (1 - input.downPaymentPercent / 100); results["purchasePrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["purchasePrice"] = Number.NaN; }
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numberOfPayments"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["purchasePrice"])) * (input.propertyTaxRate / 100) / 12; results["monthlyPropertyTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPropertyTax"] = Number.NaN; }
  try { const v = input.annualHomeInsurance / 12; results["monthlyInsurance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInsurance"] = Number.NaN; }
  try { const v = (input.loanAmount / (toNumericFormulaValue(results["purchasePrice"]))) * 100; results["loanToValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loanToValue"] = Number.NaN; }
  return results;
}


export function calculateJumbo_loan_calculator(input: Jumbo_loan_calculatorInput): Jumbo_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["loanToValue"]);
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


export interface Jumbo_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
