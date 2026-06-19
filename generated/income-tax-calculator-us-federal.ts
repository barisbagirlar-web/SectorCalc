// Auto-generated from income-tax-calculator-us-federal-schema.json
import * as z from 'zod';

export interface Income_tax_calculator_us_federalInput {
  annual_income: number;
  filing_status: number;
  pre_tax_deductions: number;
  standard_deduction: number;
  additional_income: number;
  tax_credits: number;
  dataConfidence?: number;
}

export const Income_tax_calculator_us_federalInputSchema = z.object({
  annual_income: z.number().default(75000),
  filing_status: z.number().default(0),
  pre_tax_deductions: z.number().default(5000),
  standard_deduction: z.number().default(13850),
  additional_income: z.number().default(0),
  tax_credits: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Income_tax_calculator_us_federalInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_income - input.pre_tax_deductions + input.additional_income; results["adjusted_gross_income"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_gross_income"] = 0; }
  try { const v = input.annual_income - input.pre_tax_deductions + input.additional_income; results["adjusted_gross_income_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_gross_income_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIncome_tax_calculator_us_federal(input: Income_tax_calculator_us_federalInput): Income_tax_calculator_us_federalOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjusted_gross_income_aux"]);
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


export interface Income_tax_calculator_us_federalOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
