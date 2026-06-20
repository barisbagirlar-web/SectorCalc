// Auto-generated from usda-loan-calculator-schema.json
import * as z from 'zod';

export interface Usda_loan_calculatorInput {
  baseLoanAmount: number;
  interestRate: number;
  loanTermYears: number;
  upfrontFeePercent: number;
  annualFeePercent: number;
  annualPropertyTax: number;
  annualHomeInsurance: number;
  dataConfidence?: number;
}

export const Usda_loan_calculatorInputSchema = z.object({
  baseLoanAmount: z.number().default(200000),
  interestRate: z.number().default(3.5),
  loanTermYears: z.number().default(30),
  upfrontFeePercent: z.number().default(1),
  annualFeePercent: z.number().default(0.35),
  annualPropertyTax: z.number().default(2400),
  annualHomeInsurance: z.number().default(1200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Usda_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseLoanAmount * input.upfrontFeePercent / 100; results["upfrontFeeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["upfrontFeeAmount"] = Number.NaN; }
  try { const v = input.baseLoanAmount + (toNumericFormulaValue(results["upfrontFeeAmount"])); results["totalLoanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLoanAmount"] = Number.NaN; }
  try { const v = (input.interestRate / 100) / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numberOfPayments"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalLoanAmount"])) * (toNumericFormulaValue(results["monthlyInterestRate"])) * (1 + (toNumericFormulaValue(results["monthlyInterestRate"]))) ** (toNumericFormulaValue(results["numberOfPayments"])) / ((1 + (toNumericFormulaValue(results["monthlyInterestRate"]))) ** (toNumericFormulaValue(results["numberOfPayments"])) - 1); results["monthlyPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPI"] = Number.NaN; }
  try { const v = input.annualPropertyTax / 12; results["monthlyTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyTax"] = Number.NaN; }
  try { const v = input.annualHomeInsurance / 12; results["monthlyInsurance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInsurance"] = Number.NaN; }
  try { const v = (input.baseLoanAmount * input.annualFeePercent / 100) / 12; results["monthlyAnnualFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyAnnualFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPI"])) + (toNumericFormulaValue(results["monthlyTax"])) + (toNumericFormulaValue(results["monthlyInsurance"])) + (toNumericFormulaValue(results["monthlyAnnualFee"])); results["totalMonthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonthlyPayment"] = Number.NaN; }
  return results;
}


export function calculateUsda_loan_calculator(input: Usda_loan_calculatorInput): Usda_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonthlyPayment"]);
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


export interface Usda_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
