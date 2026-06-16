// Auto-generated from income-tax-calculator-us-federal-schema.json
import * as z from 'zod';

export interface Income_tax_calculator_us_federalInput {
  annual_income: number;
  filing_status: number;
  pre_tax_deductions: number;
  standard_deduction: number;
  additional_income: number;
  tax_credits: number;
}

export const Income_tax_calculator_us_federalInputSchema = z.object({
  annual_income: z.number().default(75000),
  filing_status: z.number().default(0),
  pre_tax_deductions: z.number().default(5000),
  standard_deduction: z.number().default(13850),
  additional_income: z.number().default(0),
  tax_credits: z.number().default(0),
});

function evaluateAllFormulas(input: Income_tax_calculator_us_federalInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_income - input.pre_tax_deductions + input.additional_income; results["adjusted_gross_income"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_gross_income"] = 0; }
  try { const v = Math.max(0, (results["adjusted_gross_income"] ?? 0) - input.standard_deduction); results["taxable_income"] = Number.isFinite(v) ? v : 0; } catch { results["taxable_income"] = 0; }
  try { const v = (() => { const ti = taxable_income; let tax = 0; if (filing_status === 0) { if (ti <= 11000) tax = ti * 0.10; else if (ti <= 44725) tax = 1100 + (ti - 11000) * 0.12; else if (ti <= 95375) tax = 5147 + (ti - 44725) * 0.22; else if (ti <= 182100) tax = 16290 + (ti - 95375) * 0.24; else if (ti <= 231250) tax = 37104 + (ti - 182100) * 0.32; else if (ti <= 578125) tax = 52832 + (ti - 231250) * 0.35; else tax = 174238.25 + (ti - 578125) * 0.37; } else if (filing_status === 1) { if (ti <= 22000) tax = ti * 0.10; else if (ti <= 89450) tax = 2200 + (ti - 22000) * 0.12; else if (ti <= 190750) tax = 10294 + (ti - 89450) * 0.22; else if (ti <= 364200) tax = 32580 + (ti - 190750) * 0.24; else if (ti <= 462500) tax = 74208 + (ti - 364200) * 0.32; else if (ti <= 693750) tax = 105664 + (ti - 462500) * 0.35; else tax = 186601.5 + (ti - 693750) * 0.37; } else { if (ti <= 15700) tax = ti * 0.10; else if (ti <= 59850) tax = 1570 + (ti - 15700) * 0.12; else if (ti <= 95350) tax = 6868 + (ti - 59850) * 0.22; else if (ti <= 182100) tax = 14678 + (ti - 95350) * 0.24; else if (ti <= 231250) tax = 35498 + (ti - 182100) * 0.32; else if (ti <= 578100) tax = 51226 + (ti - 231250) * 0.35; else tax = 172603.5 + (ti - 578100) * 0.37; } return tax; })(); results["tax_before_credits"] = Number.isFinite(v) ? v : 0; } catch { results["tax_before_credits"] = 0; }
  try { const v = Math.max(0, (results["tax_before_credits"] ?? 0) - input.tax_credits); results["total_tax"] = Number.isFinite(v) ? v : 0; } catch { results["total_tax"] = 0; }
  try { const v = (results["total_tax"] ?? 0) / input.annual_income * 100; results["effective_tax_rate"] = Number.isFinite(v) ? v : 0; } catch { results["effective_tax_rate"] = 0; }
  return results;
}


export function calculateIncome_tax_calculator_us_federal(input: Income_tax_calculator_us_federalInput): Income_tax_calculator_us_federalOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_tax"] ?? 0;
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


export interface Income_tax_calculator_us_federalOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
