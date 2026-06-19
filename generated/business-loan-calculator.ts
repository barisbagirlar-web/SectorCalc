// Auto-generated from business-loan-calculator-schema.json
import * as z from 'zod';

export interface Business_loan_calculatorInput {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  originationFee: number;
  dataConfidence?: number;
}

export const Business_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(50000),
  annualRate: z.number().default(7.5),
  termYears: z.number().default(5),
  originationFee: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Business_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanAmount * (input.annualRate / 100) * input.termYears * (input.originationFee / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.loanAmount * (input.annualRate / 100) * input.termYears * (input.originationFee / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBusiness_loan_calculator(input: Business_loan_calculatorInput): Business_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Business_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
