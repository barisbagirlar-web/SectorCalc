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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brrrr_strategy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.rehabCost; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInvestment"] = Number.NaN; }
  try { const v = input.arv * input.refinanceLTV / 100; results["refinanceAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["refinanceAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalInvestment"])) - (toNumericFormulaValue(results["refinanceAmount"])); results["cashInvested"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashInvested"] = Number.NaN; }
  try { const v = input.refinanceRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numberOfPayments"] = Number.NaN; }
  try { const v = input.monthlyRent * input.operatingExpensePercentage / 100; results["monthlyOperatingExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyOperatingExpenses"] = Number.NaN; }
  try { const v = input.arv - input.purchasePrice - input.rehabCost; results["equityGained"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["equityGained"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["refinanceAmount"])) * (toNumericFormulaValue(results["monthlyInterestRate"])) * (1 + (toNumericFormulaValue(results["monthlyInterestRate"])))^(toNumericFormulaValue(results["numberOfPayments"])) / ((1 + (toNumericFormulaValue(results["monthlyInterestRate"])))^(toNumericFormulaValue(results["numberOfPayments"])) - 1); results["monthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPayment"] = Number.NaN; }
  try { const v = (input.monthlyRent - (toNumericFormulaValue(results["monthlyOperatingExpenses"])) - (toNumericFormulaValue(results["monthlyPayment"]))) * 12; results["annualCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCashFlow"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualCashFlow"])) / (toNumericFormulaValue(results["cashInvested"])) * 100; results["cashOnCashReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashOnCashReturn"] = Number.NaN; }
  return results;
}


export function calculateBrrrr_strategy_calculator(input: Brrrr_strategy_calculatorInput): Brrrr_strategy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["equityGained"]);
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


export interface Brrrr_strategy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
