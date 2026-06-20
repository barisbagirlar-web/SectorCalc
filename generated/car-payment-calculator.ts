// Auto-generated from car-payment-calculator-schema.json
import * as z from 'zod';

export interface Car_payment_calculatorInput {
  carPrice: number;
  downPayment: number;
  annualInterestRate: number;
  loanTermMonths: number;
  salesTaxRate: number;
  additionalFees: number;
  dataConfidence?: number;
}

export const Car_payment_calculatorInputSchema = z.object({
  carPrice: z.number().default(20000),
  downPayment: z.number().default(2000),
  annualInterestRate: z.number().default(4.5),
  loanTermMonths: z.number().default(60),
  salesTaxRate: z.number().default(6),
  additionalFees: z.number().default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Car_payment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carPrice * input.salesTaxRate / 100; results["salesTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["salesTax"] = Number.NaN; }
  try { const v = input.carPrice + (toNumericFormulaValue(results["salesTax"])) + input.additionalFees - input.downPayment; results["principal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["principal"] = Number.NaN; }
  try { const v = input.annualInterestRate / 12 / 100; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  return results;
}


export function calculateCar_payment_calculator(input: Car_payment_calculatorInput): Car_payment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyRate"]);
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


export interface Car_payment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
