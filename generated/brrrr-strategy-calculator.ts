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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brrrr_strategy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.rehabCost; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.arv * input.refinanceLTV / 100; results["refinanceAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["refinanceAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalInvestment"])) - (asFormulaNumber(results["refinanceAmount"])); results["cashInvested"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cashInvested"] = 0; }
  try { const v = input.refinanceRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = input.monthlyRent * input.operatingExpensePercentage / 100; results["monthlyOperatingExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyOperatingExpenses"] = 0; }
  try { const v = input.arv - input.purchasePrice - input.rehabCost; results["equityGained"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["equityGained"] = 0; }
  try { const v = (asFormulaNumber(results["refinanceAmount"])) * (asFormulaNumber(results["monthlyInterestRate"])) * (1 + (asFormulaNumber(results["monthlyInterestRate"])))^(asFormulaNumber(results["numberOfPayments"])) / ((1 + (asFormulaNumber(results["monthlyInterestRate"])))^(asFormulaNumber(results["numberOfPayments"])) - 1); results["monthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (input.monthlyRent - (asFormulaNumber(results["monthlyOperatingExpenses"])) - (asFormulaNumber(results["monthlyPayment"]))) * 12; results["annualCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualCashFlow"] = 0; }
  try { const v = (asFormulaNumber(results["annualCashFlow"])) / (asFormulaNumber(results["cashInvested"])) * 100; results["cashOnCashReturn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cashOnCashReturn"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBrrrr_strategy_calculator(input: Brrrr_strategy_calculatorInput): Brrrr_strategy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["equityGained"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
