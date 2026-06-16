// Auto-generated from vesting-calculator-schema.json
import * as z from 'zod';

export interface Vesting_calculatorInput {
  totalGrant: number;
  vestingStartMonth: number;
  currentMonth: number;
  vestingPeriodMonths: number;
  cliffPeriodMonths: number;
}

export const Vesting_calculatorInputSchema = z.object({
  totalGrant: z.number().default(1000),
  vestingStartMonth: z.number().default(0),
  currentMonth: z.number().default(12),
  vestingPeriodMonths: z.number().default(48),
  cliffPeriodMonths: z.number().default(12),
});

function evaluateAllFormulas(input: Vesting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.vestingPeriodMonths - input.cliffPeriodMonths) <= 0 ? (input.currentMonth >= input.cliffPeriodMonths ? input.totalGrant : 0) : input.totalGrant * Math.min(1, Math.max(0, (input.currentMonth - input.cliffPeriodMonths) / (input.vestingPeriodMonths - input.cliffPeriodMonths))); results["vestedShares"] = Number.isFinite(v) ? v : 0; } catch { results["vestedShares"] = 0; }
  try { const v = input.totalGrant - (results["vestedShares"] ?? 0); results["unvestedShares"] = Number.isFinite(v) ? v : 0; } catch { results["unvestedShares"] = 0; }
  return results;
}


export function calculateVesting_calculator(input: Vesting_calculatorInput): Vesting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vestedShares"] ?? 0;
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


export interface Vesting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
