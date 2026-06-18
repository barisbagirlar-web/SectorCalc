// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mortgage_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.loan_term_years * input.loan_amount; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.loan_term_years * input.loan_amount * (1 + (input.down_payment_percent / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.loan_term_years * input.loan_amount * (1 + (input.down_payment_percent / 100)) * ((input.annual_interest_rate / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.annual_interest_rate / 100); results["factor_annual_interest_rate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_annual_interest_rate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMortgage_calculator(input: Mortgage_calculatorInput): Mortgage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
