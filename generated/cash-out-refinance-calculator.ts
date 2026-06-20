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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cash_out_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.existingMortgageBalance + input.cashOutAmount + input.closingCosts; results["newLoanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newLoanAmount"] = Number.NaN; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numberOfPayments"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["newLoanAmount"])) * (toNumericFormulaValue(results["monthlyInterestRate"])) * ((1 + (toNumericFormulaValue(results["monthlyInterestRate"]))) ** (toNumericFormulaValue(results["numberOfPayments"]))) / (((1 + (toNumericFormulaValue(results["monthlyInterestRate"]))) ** (toNumericFormulaValue(results["numberOfPayments"]))) - 1); results["monthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPayment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPayment"])) * (toNumericFormulaValue(results["numberOfPayments"])); results["totalPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPayment"])) - (toNumericFormulaValue(results["newLoanAmount"])); results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInterest"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["newLoanAmount"])) / input.propertyValue) * 100; results["loanToValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loanToValue"] = Number.NaN; }
  return results;
}


export function calculateCash_out_refinance_calculator(input: Cash_out_refinance_calculatorInput): Cash_out_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyPayment"]);
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


export interface Cash_out_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
