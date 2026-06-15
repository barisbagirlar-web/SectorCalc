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
  monthly_debt: number;
  payment_frequency: string;
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
  monthly_debt: z.number().min(0).max(100000).default(500),
  payment_frequency: z.enum(['monthly', 'biweekly', 'accelerated_biweekly']).default('monthly'),
});

function evaluateAllFormulas(input: Mortgage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["property_value"] = input.loan_amount / (1 - input.down_payment_percent / 100); } catch { results["property_value"] = 0; }
  try { results["monthly_interest_rate"] = input.annual_interest_rate / 100 / 12; } catch { results["monthly_interest_rate"] = 0; }
  try { results["number_of_payments"] = input.loan_term_years * 12 * (input.payment_frequency == 'biweekly' ? 26/12 : input.payment_frequency == 'accelerated_biweekly' ? 26/12 : 1); } catch { results["number_of_payments"] = 0; }
  try { results["monthly_principal_interest"] = input.loan_amount * ((results["monthly_interest_rate"] ?? 0) * (1 + (results["monthly_interest_rate"] ?? 0))^(results["number_of_payments"] ?? 0)) / ((1 + (results["monthly_interest_rate"] ?? 0))^(results["number_of_payments"] ?? 0) - 1); } catch { results["monthly_principal_interest"] = 0; }
  try { results["monthly_taxes_insurance"] = ((results["property_value"] ?? 0) * (input.property_tax_rate / 100) + (results["property_value"] ?? 0) * (input.insurance_rate / 100)) / 12; } catch { results["monthly_taxes_insurance"] = 0; }
  try { results["monthly_payment"] = (results["monthly_principal_interest"] ?? 0) + (results["monthly_taxes_insurance"] ?? 0) + input.monthly_hoa; } catch { results["monthly_payment"] = 0; }
  try { results["total_interest"] = (results["monthly_principal_interest"] ?? 0) * (results["number_of_payments"] ?? 0) - input.loan_amount; } catch { results["total_interest"] = 0; }
  return results;
}


export function calculateMortgage_calculator(input: Mortgage_calculatorInput): Mortgage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthly_payment"] ?? 0;
  const breakdown = {
    principal_and_interest: values["principal_and_interest"] ?? 0,
    taxes_and_insurance: values["taxes_and_insurance"] ?? 0,
    hoa: values["hoa"] ?? 0,
    total_interest: values["total_interest"] ?? 0,
    property_value: values["property_value"] ?? 0,
    debt_to_income_ratio: values["debt_to_income_ratio"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Private Mortgage Insurance (PMI)","Opportunity Cost of Down Payment","Inflation Erosion of Fixed Payment"];
  const suggestedActions: string[] = ["Increase Down Payment to 20%","Consider 15-Year Term","Shop for Lower Interest Rate","Pay Down Existing Debt"];
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


export interface Mortgage_calculatorOutput {
  totalWasteCost: number;
  breakdown: { principal_and_interest: number; taxes_and_insurance: number; hoa: number; total_interest: number; property_value: number; debt_to_income_ratio: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
