// Auto-generated from brrrr-calculator-schema.json
import * as z from 'zod';

export interface Brrrr_calculatorInput {
  purchasePrice: number;
  rehabCost: number;
  afterRepairValue: number;
  monthlyRent: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  monthlyExpenses: number;
}

export const Brrrr_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100000),
  rehabCost: z.number().default(20000),
  afterRepairValue: z.number().default(150000),
  monthlyRent: z.number().default(1500),
  downPaymentPercent: z.number().default(20),
  interestRate: z.number().default(4),
  loanTermYears: z.number().default(30),
  monthlyExpenses: z.number().default(500),
});

function evaluateAllFormulas(input: Brrrr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice * (input.downPaymentPercent / 100); results["downPayment"] = Number.isFinite(v) ? v : 0; } catch { results["downPayment"] = 0; }
  try { const v = input.purchasePrice - (results["downPayment"] ?? 0); results["loanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (results["loanAmount"] ?? 0) * (results["monthlyInterestRate"] ?? 0) / (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -(results["numberOfPayments"] ?? 0))); results["monthlyMortgagePayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyMortgagePayment"] = 0; }
  try { const v = (results["downPayment"] ?? 0) + input.rehabCost; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.monthlyRent - input.monthlyExpenses - (results["monthlyMortgagePayment"] ?? 0); results["monthlyCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCashFlow"] = 0; }
  try { const v = (results["monthlyCashFlow"] ?? 0) * 12; results["annualCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["annualCashFlow"] = 0; }
  try { const v = ((results["annualCashFlow"] ?? 0) / (results["totalInvestment"] ?? 0)) * 100; results["cashOnCashReturn"] = Number.isFinite(v) ? v : 0; } catch { results["cashOnCashReturn"] = 0; }
  return results;
}


export function calculateBrrrr_calculator(input: Brrrr_calculatorInput): Brrrr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cashOnCashReturn"] ?? 0;
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


export interface Brrrr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
