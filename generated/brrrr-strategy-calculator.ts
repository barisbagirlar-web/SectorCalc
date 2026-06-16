// Auto-generated from brrrr-strategy-calculator-schema.json
import * as z from 'zod';

export interface Brrrr_strategy_calculatorInput {
  purchasePrice: number;
  rehabCost: number;
  arv: number;
  monthlyRent: number;
  operatingExpensePercentage: number;
  refinanceLTV: number;
  refinanceRate: number;
  loanTerm: number;
}

export const Brrrr_strategy_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100000),
  rehabCost: z.number().default(20000),
  arv: z.number().default(150000),
  monthlyRent: z.number().default(1200),
  operatingExpensePercentage: z.number().default(50),
  refinanceLTV: z.number().default(75),
  refinanceRate: z.number().default(4.5),
  loanTerm: z.number().default(30),
});

function evaluateAllFormulas(input: Brrrr_strategy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.rehabCost; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.arv * input.refinanceLTV / 100; results["refinanceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["refinanceAmount"] = 0; }
  try { const v = (results["totalInvestment"] ?? 0) - (results["refinanceAmount"] ?? 0); results["cashInvested"] = Number.isFinite(v) ? v : 0; } catch { results["cashInvested"] = 0; }
  try { const v = input.refinanceRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (results["refinanceAmount"] ?? 0) * ((results["monthlyInterestRate"] ?? 0) * Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["numberOfPayments"] ?? 0))) / (Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["numberOfPayments"] ?? 0)) - 1); results["monthlyMortgagePayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyMortgagePayment"] = 0; }
  try { const v = input.monthlyRent * input.operatingExpensePercentage / 100; results["monthlyOperatingExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyOperatingExpenses"] = 0; }
  try { const v = input.monthlyRent - (results["monthlyMortgagePayment"] ?? 0) - (results["monthlyOperatingExpenses"] ?? 0); results["monthlyCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCashFlow"] = 0; }
  try { const v = (results["monthlyCashFlow"] ?? 0) * 12; results["annualCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["annualCashFlow"] = 0; }
  try { const v = ((results["annualCashFlow"] ?? 0) / (results["cashInvested"] ?? 0)) * 100; results["cashOnCashReturn"] = Number.isFinite(v) ? v : 0; } catch { results["cashOnCashReturn"] = 0; }
  try { const v = input.arv - input.purchasePrice - input.rehabCost; results["equityGained"] = Number.isFinite(v) ? v : 0; } catch { results["equityGained"] = 0; }
  return results;
}


export function calculateBrrrr_strategy_calculator(input: Brrrr_strategy_calculatorInput): Brrrr_strategy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyCashFlow"] ?? 0;
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


export interface Brrrr_strategy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
