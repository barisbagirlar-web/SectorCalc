// Auto-generated from burn-rate-calculator-schema.json
import * as z from 'zod';

export interface Burn_rate_calculatorInput {
  cashReserves: number;
  monthlyFixedExpenses: number;
  monthlyVariableExpenses: number;
  monthlyRevenue: number;
  dataConfidence?: number;
}

export const Burn_rate_calculatorInputSchema = z.object({
  cashReserves: z.number().default(100000),
  monthlyFixedExpenses: z.number().default(20000),
  monthlyVariableExpenses: z.number().default(10000),
  monthlyRevenue: z.number().default(5000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Burn_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyFixedExpenses + input.monthlyVariableExpenses; results["totalExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = input.monthlyFixedExpenses + input.monthlyVariableExpenses; results["grossBurnRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossBurnRate"] = 0; }
  try { const v = input.monthlyFixedExpenses + input.monthlyVariableExpenses - input.monthlyRevenue; results["netBurnRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netBurnRate"] = 0; }
  try { const v = (asFormulaNumber(results["netBurnRate"])) > 0 ? input.cashReserves / (asFormulaNumber(results["netBurnRate"])) : null; results["runway"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["runway"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBurn_rate_calculator(input: Burn_rate_calculatorInput): Burn_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["runway"]));
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


export interface Burn_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
