// Auto-generated from biweekly-mortgage-calculator-schema.json
import * as z from 'zod';

export interface Biweekly_mortgage_calculatorInput {
  principal: number;
  annualRate: number;
  termYears: number;
  extraBiweekly: number;
}

export const Biweekly_mortgage_calculatorInputSchema = z.object({
  principal: z.number().default(250000),
  annualRate: z.number().default(6.5),
  termYears: z.number().default(30),
  extraBiweekly: z.number().default(0),
});

function evaluateAllFormulas(input: Biweekly_mortgage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.termYears * 12; results["numberOfMonths"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfMonths"] = 0; }
  try { const v = input.principal * ((results["monthlyRate"] ?? 0) * Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numberOfMonths"] ?? 0))) / (Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numberOfMonths"] ?? 0)) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) / 2; results["biweeklyBase"] = Number.isFinite(v) ? v : 0; } catch { results["biweeklyBase"] = 0; }
  try { const v = (results["biweeklyBase"] ?? 0) + input.extraBiweekly; results["biweeklyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["biweeklyPayment"] = 0; }
  try { const v = Math.pow(1 + input.annualRate/100, 1/26) - 1; results["r_bw"] = Number.isFinite(v) ? v : 0; } catch { results["r_bw"] = 0; }
  try { const v = -Math.log(1 - input.principal * (results["r_bw"] ?? 0) / (results["biweeklyPayment"] ?? 0)) / Math.log(1 + (results["r_bw"] ?? 0)); results["n_bw"] = Number.isFinite(v) ? v : 0; } catch { results["n_bw"] = 0; }
  try { const v = (results["n_bw"] ?? 0) / 26; results["payoffYearsBiweekly"] = Number.isFinite(v) ? v : 0; } catch { results["payoffYearsBiweekly"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (results["numberOfMonths"] ?? 0) - input.principal; results["totalInterestMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestMonthly"] = 0; }
  try { const v = (results["biweeklyPayment"] ?? 0) * (results["n_bw"] ?? 0) - input.principal; results["totalInterestBiweekly"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestBiweekly"] = 0; }
  try { const v = (results["totalInterestMonthly"] ?? 0) - (results["totalInterestBiweekly"] ?? 0); results["interestSaved"] = Number.isFinite(v) ? v : 0; } catch { results["interestSaved"] = 0; }
  return results;
}


export function calculateBiweekly_mortgage_calculator(input: Biweekly_mortgage_calculatorInput): Biweekly_mortgage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["interestSaved"] ?? 0;
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


export interface Biweekly_mortgage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
