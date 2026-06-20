// Auto-generated from mortgage-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_calculatorInput {
  loan_amount: number;
  down_payment_percent: number;
  annual_interest_rate: number;
  loan_term_years: number;
  property_tax_rate: number;
  insurance_rate: number;
  monthly_hoa: number;
  annual_income: number;
  dataConfidence?: number;
}

export const Mortgage_calculatorInputSchema = z.object({
  loan_amount: z.number().min(10000).max(10000000).default(300000),
  down_payment_percent: z.number().min(0).max(100).default(20),
  annual_interest_rate: z.number().min(0.1).max(30).default(6.5),
  loan_term_years: z.number().min(1).max(40).default(30),
  property_tax_rate: z.number().min(0).max(5).default(1.2),
  insurance_rate: z.number().min(0.1).max(3).default(0.5),
  monthly_hoa: z.number().min(0).max(5000).default(0),
  annual_income: z.number().min(0).max(10000000).default(120000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortgage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.loan_amount * (input.annual_interest_rate / 100 / 12) * ((1 + input.annual_interest_rate / 100 / 12) ** (input.loan_term_years * 12))) / (((1 + input.annual_interest_rate / 100 / 12) ** (input.loan_term_years * 12)) - 1) + (input.loan_amount / (1 - input.down_payment_percent / 100) * input.property_tax_rate / 100 / 12) + (input.loan_amount / (1 - input.down_payment_percent / 100) * input.insurance_rate / 100 / 12) + input.monthly_hoa) * 12; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = ((input.loan_amount * (input.annual_interest_rate / 100 / 12) * ((1 + input.annual_interest_rate / 100 / 12) ** (input.loan_term_years * 12))) / (((1 + input.annual_interest_rate / 100 / 12) ** (input.loan_term_years * 12)) - 1) * (input.loan_term_years * 12) - input.loan_amount); results["total_interest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_interest"] = Number.NaN; }
  try { const v = ((input.loan_amount * (input.annual_interest_rate / 100 / 12) * ((1 + input.annual_interest_rate / 100 / 12) ** (input.loan_term_years * 12))) / (((1 + input.annual_interest_rate / 100 / 12) ** (input.loan_term_years * 12)) - 1) + (input.loan_amount / (1 - input.down_payment_percent / 100) * input.property_tax_rate / 100 / 12) + (input.loan_amount / (1 - input.down_payment_percent / 100) * input.insurance_rate / 100 / 12) + input.monthly_hoa) / (input.annual_income / 12) * 100; results["dti_ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dti_ratio"] = Number.NaN; }
  return results;
}


export function calculateMortgage_calculator(input: Mortgage_calculatorInput): Mortgage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Private Mortgage Insurance (PMI) if down payment < 20%","Escrow account shortfalls due to tax reassessment"];
  const suggestedActions: string[] = ["Increase down payment to 20% to eliminate PMI","Shop for lower homeowner's insurance rates"];
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


export interface Mortgage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
