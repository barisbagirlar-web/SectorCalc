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

function evaluateAllFormulas(input: Debt_to_capital_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.commonStock + input.preferredStock + input.retainedEarnings + input.otherEquity; results["totalEquity"] = Number.isFinite(v) ? v : 0; } catch { results["totalEquity"] = 0; }
  try { const v = input.totalDebt + (results["totalEquity"] ?? 0); results["totalCapital"] = Number.isFinite(v) ? v : 0; } catch { results["totalCapital"] = 0; }
  try { const v = (input.totalDebt / (results["totalCapital"] ?? 0)) * 100; results["debtToCapitalRatio"] = Number.isFinite(v) ? v : 0; } catch { results["debtToCapitalRatio"] = 0; }
  return results;
}


export function calculateDebt_to_capital_ratio_calculator(input: Debt_to_capital_ratio_calculatorInput): Debt_to_capital_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["debtToCapitalRatio"] ?? 0;
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


export interface Debt_to_capital_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
