// Auto-generated from lean-fire-calculator-schema.json
import * as z from 'zod';

export interface Lean_fire_calculatorInput {
  annualExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
  safeWithdrawalRate: number;
}

export const Lean_fire_calculatorInputSchema = z.object({
  annualExpenses: z.number().default(30000),
  currentSavings: z.number().default(50000),
  monthlyContribution: z.number().default(1000),
  annualReturnRate: z.number().default(7),
  safeWithdrawalRate: z.number().default(4),
});

function evaluateAllFormulas(input: Lean_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualExpenses / (input.safeWithdrawalRate / 100); results["fireNumber"] = Number.isFinite(v) ? v : 0; } catch { results["fireNumber"] = 0; }
  try { const v = input.monthlyContribution * 12; results["annualContribution"] = Number.isFinite(v) ? v : 0; } catch { results["annualContribution"] = 0; }
  try { const v = input.annualReturnRate / 100; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = (results["annualContribution"] ?? 0) > 0 ? Math.log(((results["fireNumber"] ?? 0) * (results["r"] ?? 0) + (results["annualContribution"] ?? 0)) / (input.currentSavings * (results["r"] ?? 0) + (results["annualContribution"] ?? 0))) / Math.log(1 + (results["r"] ?? 0)) : Math.log((results["fireNumber"] ?? 0) / input.currentSavings) / Math.log(1 + (results["r"] ?? 0)); results["yearsToFire"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToFire"] = 0; }
  try { const v = ((results["fireNumber"] ?? 0) * (input.safeWithdrawalRate / 100)) / 12; results["monthlySafeWithdrawal"] = Number.isFinite(v) ? v : 0; } catch { results["monthlySafeWithdrawal"] = 0; }
  return results;
}


export function calculateLean_fire_calculator(input: Lean_fire_calculatorInput): Lean_fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yearsToFire"] ?? 0;
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


export interface Lean_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
