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

function evaluateAllFormulas(input: Rent_vs_buy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loanInterestRate/100/12; results["monthlyInterest"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterest"] = 0; }
  try { const v = input.loanTermYears * 12; results["months"] = Number.isFinite(v) ? v : 0; } catch { results["months"] = 0; }
  try { const v = (results["monthlyInterest"] ?? 0) === 0 ? (input.purchasePrice * (1 - input.downPaymentPercentage/100)) / (results["months"] ?? 0) : (input.purchasePrice * (1 - input.downPaymentPercentage/100)) * ((results["monthlyInterest"] ?? 0) * Math.pow(1+(results["monthlyInterest"] ?? 0), (results["months"] ?? 0))) / (Math.pow(1+(results["monthlyInterest"] ?? 0), (results["months"] ?? 0)) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = input.purchasePrice * input.downPaymentPercentage/100; results["downPayment"] = Number.isFinite(v) ? v : 0; } catch { results["downPayment"] = 0; }
  try { const v = (results["downPayment"] ?? 0) + ((results["monthlyPayment"] ?? 0) * (results["months"] ?? 0)); results["totalBuyingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalBuyingCost"] = 0; }
  try { const v = input.annualRentIncrease/100; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = (results["r"] ?? 0) === 0 ? 12*input.monthlyRent*input.loanTermYears : 12*input.monthlyRent*(Math.pow(1+(results["r"] ?? 0), input.loanTermYears)-1)/(results["r"] ?? 0); results["totalRentingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalRentingCost"] = 0; }
  try { const v = (results["totalBuyingCost"] ?? 0) - (results["totalRentingCost"] ?? 0); results["netCostDifference"] = Number.isFinite(v) ? v : 0; } catch { results["netCostDifference"] = 0; }
  return results;
}


export function calculateRent_vs_buy_calculator(input: Rent_vs_buy_calculatorInput): Rent_vs_buy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netCostDifference"] ?? 0;
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


export interface Rent_vs_buy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
