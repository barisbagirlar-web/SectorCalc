// Auto-generated from burn-rate-calculator-schema.json
import * as z from 'zod';

export interface Burn_rate_calculatorInput {
  cashReserves: number;
  monthlyFixedExpenses: number;
  monthlyVariableExpenses: number;
  monthlyRevenue: number;
}

export const Burn_rate_calculatorInputSchema = z.object({
  cashReserves: z.number().default(100000),
  monthlyFixedExpenses: z.number().default(20000),
  monthlyVariableExpenses: z.number().default(10000),
  monthlyRevenue: z.number().default(5000),
});

function evaluateAllFormulas(input: Burn_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyFixedExpenses + input.monthlyVariableExpenses; results["totalExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = input.monthlyFixedExpenses + input.monthlyVariableExpenses; results["grossBurnRate"] = Number.isFinite(v) ? v : 0; } catch { results["grossBurnRate"] = 0; }
  try { const v = input.monthlyFixedExpenses + input.monthlyVariableExpenses - input.monthlyRevenue; results["netBurnRate"] = Number.isFinite(v) ? v : 0; } catch { results["netBurnRate"] = 0; }
  try { const v = (results["netBurnRate"] ?? 0) > 0 ? input.cashReserves / (results["netBurnRate"] ?? 0) : null; results["runway"] = Number.isFinite(v) ? v : 0; } catch { results["runway"] = 0; }
  return results;
}


export function calculateBurn_rate_calculator(input: Burn_rate_calculatorInput): Burn_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["runway"] ?? 0;
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


export interface Burn_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
