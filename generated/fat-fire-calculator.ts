// Auto-generated from fat-fire-calculator-schema.json
import * as z from 'zod';

export interface Fat_fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  annualRetirementExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
  inflationRate: number;
  safeWithdrawalRate: number;
}

export const Fat_fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  annualRetirementExpenses: z.number().default(100000),
  currentSavings: z.number().default(0),
  monthlyContribution: z.number().default(0),
  annualReturnRate: z.number().default(0.07),
  inflationRate: z.number().default(0.03),
  safeWithdrawalRate: z.number().default(0.04),
});

function evaluateAllFormulas(input: Fat_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToRetirement"] = 0; }
  try { const v = input.annualRetirementExpenses * ((1 + input.inflationRate) ** (results["yearsToRetirement"] ?? 0)); results["adjustedExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedExpenses"] = 0; }
  try { const v = (results["adjustedExpenses"] ?? 0) / input.safeWithdrawalRate; results["requiredCorpus"] = Number.isFinite(v) ? v : 0; } catch { results["requiredCorpus"] = 0; }
  try { const v = input.currentSavings * ((1 + input.annualReturnRate) ** (results["yearsToRetirement"] ?? 0)); results["futureValueCurrentSavings"] = Number.isFinite(v) ? v : 0; } catch { results["futureValueCurrentSavings"] = 0; }
  try { const v = (input.monthlyContribution * 12) * (((1 + input.annualReturnRate) ** (results["yearsToRetirement"] ?? 0) - 1) / input.annualReturnRate); results["futureValueContributions"] = Number.isFinite(v) ? v : 0; } catch { results["futureValueContributions"] = 0; }
  try { const v = (results["futureValueCurrentSavings"] ?? 0) + (results["futureValueContributions"] ?? 0); results["totalSavingsAtRetirement"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavingsAtRetirement"] = 0; }
  try { const v = (results["requiredCorpus"] ?? 0) - (results["totalSavingsAtRetirement"] ?? 0); results["shortfall"] = Number.isFinite(v) ? v : 0; } catch { results["shortfall"] = 0; }
  return results;
}


export function calculateFat_fire_calculator(input: Fat_fire_calculatorInput): Fat_fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shortfall"] ?? 0;
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


export interface Fat_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
