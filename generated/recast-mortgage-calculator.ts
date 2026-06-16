// Auto-generated from recast-mortgage-calculator-schema.json
import * as z from 'zod';

export interface Recast_mortgage_calculatorInput {
  currentBalance: number;
  annualInterestRate: number;
  remainingTerm: number;
  lumpSumPayment: number;
  recastFee: number;
}

export const Recast_mortgage_calculatorInputSchema = z.object({
  currentBalance: z.number().default(200000),
  annualInterestRate: z.number().default(4.5),
  remainingTerm: z.number().default(180),
  lumpSumPayment: z.number().default(50000),
  recastFee: z.number().default(250),
});

function evaluateAllFormulas(input: Recast_mortgage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.currentBalance * (results["monthlyInterestRate"] ?? 0) / (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -input.remainingTerm)); results["originalMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["originalMonthlyPayment"] = 0; }
  try { const v = input.currentBalance - input.lumpSumPayment; results["newBalance"] = Number.isFinite(v) ? v : 0; } catch { results["newBalance"] = 0; }
  try { const v = (results["newBalance"] ?? 0) * (results["monthlyInterestRate"] ?? 0) / (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -input.remainingTerm)); results["newMonthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["newMonthlyPayment"] = 0; }
  try { const v = (results["originalMonthlyPayment"] ?? 0) - (results["newMonthlyPayment"] ?? 0); results["monthlySavings"] = Number.isFinite(v) ? v : 0; } catch { results["monthlySavings"] = 0; }
  try { const v = (results["monthlySavings"] ?? 0) * input.remainingTerm - input.recastFee; results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  try { const v = (results["monthlySavings"] ?? 0) > 0 ? Math.ceil(input.recastFee / (results["monthlySavings"] ?? 0)) : 0; results["breakEvenMonths"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenMonths"] = 0; }
  return results;
}


export function calculateRecast_mortgage_calculator(input: Recast_mortgage_calculatorInput): Recast_mortgage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["newMonthlyPayment"] ?? 0;
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


export interface Recast_mortgage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
