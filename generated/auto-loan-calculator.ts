// Auto-generated from auto-loan-calculator-schema.json
import * as z from 'zod';

export interface Auto_loan_calculatorInput {
  vehicle_price: number;
  down_payment: number;
  trade_in_value: number;
  annual_interest_rate: number;
  loan_term_months: number;
  credit_score: number;
  monthly_income: number;
  existing_monthly_debt: number;
  insurance_cost_monthly: number;
  fuel_cost_monthly: number;
  maintenance_cost_monthly: number;
  depreciation_rate_annual: number;
  sales_tax_rate: number;
  registration_fee_annual: number;
}

export const Auto_loan_calculatorInputSchema = z.object({
  vehicle_price: z.number().min(1000).max(200000).default(35000),
  down_payment: z.number().min(0).max(100000).default(5000),
  trade_in_value: z.number().min(0).max(100000).default(0),
  annual_interest_rate: z.number().min(0.5).max(25).default(6.5),
  loan_term_months: z.number().min(12).max(84).default(60),
  credit_score: z.number().min(300).max(850).default(700),
  monthly_income: z.number().min(1000).max(50000).default(5000),
  existing_monthly_debt: z.number().min(0).max(20000).default(500),
  insurance_cost_monthly: z.number().min(30).max(500).default(120),
  fuel_cost_monthly: z.number().min(0).max(1000).default(150),
  maintenance_cost_monthly: z.number().min(0).max(500).default(80),
  depreciation_rate_annual: z.number().min(5).max(40).default(15),
  sales_tax_rate: z.number().min(0).max(15).default(7),
  registration_fee_annual: z.number().min(0).max(2000).default(200),
});

function evaluateAllFormulas(input: Auto_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["loan_amount"] = input.vehicle_price - input.down_payment - input.trade_in_value; } catch { results["loan_amount"] = 0; }
  try { results["monthly_interest_rate"] = (input.annual_interest_rate / 100) / 12; } catch { results["monthly_interest_rate"] = 0; }
  try { results["estimated_monthly_payment"] = (results["loan_amount"] ?? 0) * ((results["monthly_interest_rate"] ?? 0) * (1 + (results["monthly_interest_rate"] ?? 0))^input.loan_term_months) / ((1 + (results["monthly_interest_rate"] ?? 0))^input.loan_term_months - 1); } catch { results["estimated_monthly_payment"] = 0; }
  try { results["total_interest_paid"] = (results["estimated_monthly_payment"] ?? 0) * input.loan_term_months - (results["loan_amount"] ?? 0); } catch { results["total_interest_paid"] = 0; }
  try { results["total_operating_cost_monthly"] = (results["estimated_monthly_payment"] ?? 0) + input.insurance_cost_monthly + input.fuel_cost_monthly + input.maintenance_cost_monthly + (input.registration_fee_annual / 12); } catch { results["total_operating_cost_monthly"] = 0; }
  try { results["total_cost_of_ownership"] = (results["loan_amount"] ?? 0) + (results["total_interest_paid"] ?? 0) + ((results["total_operating_cost_monthly"] ?? 0) * 60) + (input.vehicle_price * (input.depreciation_rate_annual / 100) * 5) + (input.vehicle_price * (input.sales_tax_rate / 100)); } catch { results["total_cost_of_ownership"] = 0; }
  try { results["debt_to_income_ratio"] = (input.existing_monthly_debt + (results["estimated_monthly_payment"] ?? 0)) / input.monthly_income * 100; } catch { results["debt_to_income_ratio"] = 0; }
  return results;
}


export function calculateAuto_loan_calculator(input: Auto_loan_calculatorInput): Auto_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimated_monthly_payment"] ?? 0;
  const breakdown = {
    loan_amount: values["loan_amount"] ?? 0,
    total_interest_paid: values["total_interest_paid"] ?? 0,
    total_operating_cost_monthly: values["total_operating_cost_monthly"] ?? 0,
    total_cost_of_ownership: values["total_cost_of_ownership"] ?? 0,
    debt_to_income_ratio: values["debt_to_income_ratio"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Depreciation Impact","Opportunity Cost of Down Payment","Insurance Premium Inflation"];
  const suggestedActions: string[] = ["Increase Down Payment","Shorten Loan Term to 48 Months","Improve Credit Score to 740+","Reduce Operating Costs"];
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


export interface Auto_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: { loan_amount: number; total_interest_paid: number; total_operating_cost_monthly: number; total_cost_of_ownership: number; debt_to_income_ratio: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
