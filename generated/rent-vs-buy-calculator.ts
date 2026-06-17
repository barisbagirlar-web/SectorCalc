// @ts-nocheck
// Auto-generated from rent-vs-buy-calculator-schema.json
import * as z from 'zod';

export interface Rent_vs_buy_calculatorInput {
  purchasePrice: number;
  downPaymentPercentage: number;
  loanInterestRate: number;
  loanTermYears: number;
  monthlyRent: number;
  annualRentIncrease: number;
}

export const Rent_vs_buy_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(200000),
  downPaymentPercentage: z.number().default(20),
  loanInterestRate: z.number().default(5),
  loanTermYears: z.number().default(20),
  monthlyRent: z.number().default(1000),
  annualRentIncrease: z.number().default(3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rent_vs_buy_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.loanInterestRate/100/12; results["monthlyInterest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterest"] = 0; }
  try { const v = input.loanTermYears * 12; results["months"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["months"] = 0; }
  try { const v = input.purchasePrice * input.downPaymentPercentage/100; results["downPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["downPayment"] = 0; }
  try { const v = input.annualRentIncrease/100; results["r"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["r"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRent_vs_buy_calculator(input: Rent_vs_buy_calculatorInput): Rent_vs_buy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["r"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
