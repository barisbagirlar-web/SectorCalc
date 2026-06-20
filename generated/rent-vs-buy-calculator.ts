// Auto-generated from rent-vs-buy-calculator-schema.json
import * as z from 'zod';

export interface Rent_vs_buy_calculatorInput {
  purchasePrice: number;
  downPaymentPercentage: number;
  loanInterestRate: number;
  loanTermYears: number;
  monthlyRent: number;
  annualRentIncrease: number;
  dataConfidence?: number;
}

export const Rent_vs_buy_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(200000),
  downPaymentPercentage: z.number().default(20),
  loanInterestRate: z.number().default(5),
  loanTermYears: z.number().default(20),
  monthlyRent: z.number().default(1000),
  annualRentIncrease: z.number().default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rent_vs_buy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanInterestRate/100/12; results["monthlyInterest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterest"] = Number.NaN; }
  try { const v = input.loanTermYears * 12; results["months"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["months"] = Number.NaN; }
  try { const v = input.purchasePrice * input.downPaymentPercentage/100; results["downPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downPayment"] = Number.NaN; }
  try { const v = input.annualRentIncrease/100; results["r"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r"] = Number.NaN; }
  return results;
}


export function calculateRent_vs_buy_calculator(input: Rent_vs_buy_calculatorInput): Rent_vs_buy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["r"]);
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


export interface Rent_vs_buy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
