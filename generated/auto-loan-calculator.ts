// Auto-generated from auto-loan-calculator-schema.json
import * as z from 'zod';

export interface Auto_loan_calculatorInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRate: number;
  interestRate: number;
  loanTerm: number;
}

export const Auto_loan_calculatorInputSchema = z.object({
  vehiclePrice: z.number().default(30000),
  downPayment: z.number().default(5000),
  tradeInValue: z.number().default(0),
  salesTaxRate: z.number().default(8),
  interestRate: z.number().default(5),
  loanTerm: z.number().default(60),
});

function evaluateAllFormulas(input: Auto_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vehiclePrice + (input.vehiclePrice - input.tradeInValue) * input.salesTaxRate / 100 - input.downPayment - input.tradeInValue; results["loanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = (results["loanAmount"] ?? 0) * (results["monthlyInterestRate"] ?? 0) * Math.pow(1 + (results["monthlyInterestRate"] ?? 0), input.loanTerm) / (Math.pow(1 + (results["monthlyInterestRate"] ?? 0), input.loanTerm) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.loanTerm - (results["loanAmount"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.loanTerm; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateAuto_loan_calculator(input: Auto_loan_calculatorInput): Auto_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPayment"] ?? 0;
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


export interface Auto_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
