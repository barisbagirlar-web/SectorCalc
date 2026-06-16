// Auto-generated from high-yield-savings-calculator-schema.json
import * as z from 'zod';

export interface High_yield_savings_calculatorInput {
  initialDeposit: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  compoundFrequency: number;
}

export const High_yield_savings_calculatorInputSchema = z.object({
  initialDeposit: z.number().default(1000),
  monthlyContribution: z.number().default(200),
  annualInterestRate: z.number().default(2.5),
  years: z.number().default(10),
  compoundFrequency: z.number().default(12),
});

function evaluateAllFormulas(input: High_yield_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / input.compoundFrequency; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.years * input.compoundFrequency; results["totalPeriods"] = Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  try { const v = (results["monthlyRate"] ?? 0) === 0 ? (input.initialDeposit + input.monthlyContribution * (results["totalPeriods"] ?? 0)) : (input.initialDeposit * Math.pow(1 + (results["monthlyRate"] ?? 0), (results["totalPeriods"] ?? 0)) + input.monthlyContribution * ((Math.pow(1 + (results["monthlyRate"] ?? 0), (results["totalPeriods"] ?? 0)) - 1) / (results["monthlyRate"] ?? 0))); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = input.initialDeposit + input.monthlyContribution * (results["totalPeriods"] ?? 0); results["totalDeposits"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeposits"] = 0; }
  try { const v = (results["futureValue"] ?? 0) - (results["totalDeposits"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateHigh_yield_savings_calculator(input: High_yield_savings_calculatorInput): High_yield_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["futureValue"] ?? 0;
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


export interface High_yield_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
