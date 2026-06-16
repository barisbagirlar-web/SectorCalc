// Auto-generated from financial-independence-calculator-schema.json
import * as z from 'zod';

export interface Financial_independence_calculatorInput {
  currentAge: number;
  currentPortfolio: number;
  monthlySavings: number;
  annualExpenses: number;
  annualReturn: number;
  safeWithdrawalRate: number;
}

export const Financial_independence_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  currentPortfolio: z.number().default(50000),
  monthlySavings: z.number().default(2000),
  annualExpenses: z.number().default(40000),
  annualReturn: z.number().default(7),
  safeWithdrawalRate: z.number().default(4),
});

function evaluateAllFormulas(input: Financial_independence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualExpenses/(input.safeWithdrawalRate/100); results["fiTarget"] = Number.isFinite(v) ? v : 0; } catch { results["fiTarget"] = 0; }
  try { const v = input.monthlySavings*12; results["annualSavings"] = Number.isFinite(v) ? v : 0; } catch { results["annualSavings"] = 0; }
  try { const v = (()=>{const r=annualReturn/100;const s=monthlySavings*12;const fi=annualExpenses/(safeWithdrawalRate/100);if(currentPortfolio>=fi)return 0;if(r<=0)return(fi-currentPortfolio)/s;return Math.log((fi+s/r)/(currentPortfolio+s/r))/Math.log(1+r);})(); results["yearsToFI"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToFI"] = 0; }
  return results;
}


export function calculateFinancial_independence_calculator(input: Financial_independence_calculatorInput): Financial_independence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yearsToFI"] ?? 0;
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


export interface Financial_independence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
