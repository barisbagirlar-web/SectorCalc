// Auto-generated from debt-to-capital-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_capital_ratio_calculatorInput {
  totalDebt: number;
  commonStock: number;
  preferredStock: number;
  retainedEarnings: number;
  otherEquity: number;
  dataConfidence?: number;
}

export const Debt_to_capital_ratio_calculatorInputSchema = z.object({
  totalDebt: z.number().default(0),
  commonStock: z.number().default(0),
  preferredStock: z.number().default(0),
  retainedEarnings: z.number().default(0),
  otherEquity: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Debt_to_capital_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalDebt * input.commonStock * input.preferredStock * input.retainedEarnings; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.totalDebt * input.commonStock * input.preferredStock * input.retainedEarnings * (input.otherEquity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.otherEquity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDebt_to_capital_ratio_calculator(input: Debt_to_capital_ratio_calculatorInput): Debt_to_capital_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Debt_to_capital_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
