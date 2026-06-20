// Auto-generated from latte-factor-calculator-schema.json
import * as z from 'zod';

export interface Latte_factor_calculatorInput {
  dailyExpense: number;
  daysPerWeek: number;
  years: number;
  annualReturnRate: number;
  dataConfidence?: number;
}

export const Latte_factor_calculatorInputSchema = z.object({
  dailyExpense: z.number().default(5),
  daysPerWeek: z.number().default(5),
  years: z.number().default(10),
  annualReturnRate: z.number().default(7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Latte_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyExpense * input.daysPerWeek * 52; results["annualContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualContribution"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualContribution"])) * input.years; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualContribution"])) * ((1 + (input.annualReturnRate/100))**input.years - 1) / (input.annualReturnRate/100); results["futureValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["futureValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["futureValue"])) - (toNumericFormulaValue(results["totalContributions"])); results["interestEarned"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["interestEarned"] = Number.NaN; }
  return results;
}


export function calculateLatte_factor_calculator(input: Latte_factor_calculatorInput): Latte_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["futureValue"]);
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


export interface Latte_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
