// Auto-generated from auto-loan-calculator-schema.json
import * as z from 'zod';

export interface Auto_loan_calculatorInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRate: number;
  interestRate: number;
  loanTerm: number;
  dataConfidence?: number;
}

export const Auto_loan_calculatorInputSchema = z.object({
  vehiclePrice: z.number().default(30000),
  downPayment: z.number().default(5000),
  tradeInValue: z.number().default(0),
  salesTaxRate: z.number().default(8),
  interestRate: z.number().default(5),
  loanTerm: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Auto_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vehiclePrice + (input.vehiclePrice - input.tradeInValue) * input.salesTaxRate / 100 - input.downPayment - input.tradeInValue; results["loanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAuto_loan_calculator(input: Auto_loan_calculatorInput): Auto_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyInterestRate"]);
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


export interface Auto_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
