// @ts-nocheck
// Auto-generated from debt-to-capital-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_capital_ratio_calculatorInput {
  totalDebt: number;
  commonStock: number;
  preferredStock: number;
  retainedEarnings: number;
  otherEquity: number;
}

export const Debt_to_capital_ratio_calculatorInputSchema = z.object({
  totalDebt: z.number().default(0),
  commonStock: z.number().default(0),
  preferredStock: z.number().default(0),
  retainedEarnings: z.number().default(0),
  otherEquity: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Debt_to_capital_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.commonStock + input.preferredStock + input.retainedEarnings + input.otherEquity; results["totalEquity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalEquity"] = 0; }
  try { const v = input.totalDebt + (asFormulaNumber(results["totalEquity"])); results["totalCapital"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCapital"] = 0; }
  try { const v = (input.totalDebt / (asFormulaNumber(results["totalCapital"]))) * 100; results["debtToCapitalRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["debtToCapitalRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDebt_to_capital_ratio_calculator(input: Debt_to_capital_ratio_calculatorInput): Debt_to_capital_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["debtToCapitalRatio"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Debt_to_capital_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
