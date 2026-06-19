// Auto-generated from lean-fire-calculator-schema.json
import * as z from 'zod';

export interface Lean_fire_calculatorInput {
  annualExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
  safeWithdrawalRate: number;
  dataConfidence?: number;
}

export const Lean_fire_calculatorInputSchema = z.object({
  annualExpenses: z.number().default(30000),
  currentSavings: z.number().default(50000),
  monthlyContribution: z.number().default(1000),
  annualReturnRate: z.number().default(7),
  safeWithdrawalRate: z.number().default(4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lean_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualExpenses / (input.safeWithdrawalRate / 100); results["fireNumber"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fireNumber"] = 0; }
  try { const v = input.monthlyContribution * 12; results["annualContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualContribution"] = 0; }
  try { const v = input.annualReturnRate / 100; results["r"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = ((asFormulaNumber(results["fireNumber"])) * (input.safeWithdrawalRate / 100)) / 12; results["monthlySafeWithdrawal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlySafeWithdrawal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLean_fire_calculator(input: Lean_fire_calculatorInput): Lean_fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlySafeWithdrawal"]);
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


export interface Lean_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
