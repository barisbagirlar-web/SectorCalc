// Auto-generated from car-payment-calculator-schema.json
import * as z from 'zod';

export interface Car_payment_calculatorInput {
  carPrice: number;
  downPayment: number;
  annualInterestRate: number;
  loanTermMonths: number;
  salesTaxRate: number;
  additionalFees: number;
}

export const Car_payment_calculatorInputSchema = z.object({
  carPrice: z.number().default(20000),
  downPayment: z.number().default(2000),
  annualInterestRate: z.number().default(4.5),
  loanTermMonths: z.number().default(60),
  salesTaxRate: z.number().default(6),
  additionalFees: z.number().default(500),
});

function evaluateAllFormulas(input: Car_payment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carPrice * input.salesTaxRate / 100; results["salesTax"] = Number.isFinite(v) ? v : 0; } catch { results["salesTax"] = 0; }
  try { const v = input.carPrice + (results["salesTax"] ?? 0) + input.additionalFees - input.downPayment; results["principal"] = Number.isFinite(v) ? v : 0; } catch { results["principal"] = 0; }
  try { const v = input.annualInterestRate / 12 / 100; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = (results["principal"] ?? 0) * (results["monthlyRate"] ?? 0) * Math.pow(1 + (results["monthlyRate"] ?? 0), input.loanTermMonths) / (Math.pow(1 + (results["monthlyRate"] ?? 0), input.loanTermMonths) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.loanTermMonths; results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - (results["principal"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateCar_payment_calculator(input: Car_payment_calculatorInput): Car_payment_calculatorOutput {
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


export interface Car_payment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
