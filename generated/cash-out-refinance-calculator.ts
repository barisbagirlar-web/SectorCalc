// Auto-generated from cash-out-refinance-calculator-schema.json
import * as z from 'zod';

export interface Cash_out_refinance_calculatorInput {
  propertyValue: number;
  existingMortgageBalance: number;
  cashOutAmount: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
  dataConfidence?: number;
}

export const Cash_out_refinance_calculatorInputSchema = z.object({
  propertyValue: z.number().default(300000),
  existingMortgageBalance: z.number().default(200000),
  cashOutAmount: z.number().default(50000),
  interestRate: z.number().default(5),
  loanTerm: z.number().default(30),
  closingCosts: z.number().default(5000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cash_out_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.existingMortgageBalance + input.cashOutAmount + input.closingCosts; results["newLoanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["newLoanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (asFormulaNumber(results["newLoanAmount"])) * (asFormulaNumber(results["monthlyInterestRate"])) * ((1 + (asFormulaNumber(results["monthlyInterestRate"]))) ** (asFormulaNumber(results["numberOfPayments"]))) / (((1 + (asFormulaNumber(results["monthlyInterestRate"]))) ** (asFormulaNumber(results["numberOfPayments"]))) - 1); results["monthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyPayment"])) * (asFormulaNumber(results["numberOfPayments"])); results["totalPayment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (asFormulaNumber(results["totalPayment"])) - (asFormulaNumber(results["newLoanAmount"])); results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = ((asFormulaNumber(results["newLoanAmount"])) / input.propertyValue) * 100; results["loanToValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["loanToValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCash_out_refinance_calculator(input: Cash_out_refinance_calculatorInput): Cash_out_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["monthlyPayment"]));
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


export interface Cash_out_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
