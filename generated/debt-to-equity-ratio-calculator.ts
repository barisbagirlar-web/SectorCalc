// Auto-generated from debt-to-equity-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_equity_ratio_calculatorInput {
  totalAssets: number;
  longTermDebt: number;
  currentLiabilities: number;
  otherLiabilities: number;
  dataConfidence?: number;
}

export const Debt_to_equity_ratio_calculatorInputSchema = z.object({
  totalAssets: z.number().default(200000),
  longTermDebt: z.number().default(40000),
  currentLiabilities: z.number().default(60000),
  otherLiabilities: z.number().default(10000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Debt_to_equity_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.longTermDebt + input.currentLiabilities + input.otherLiabilities; results["totalLiabilities"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLiabilities"] = Number.NaN; }
  try { const v = input.totalAssets - (toNumericFormulaValue(results["totalLiabilities"])); results["shareholdersEquity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shareholdersEquity"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalLiabilities"])) / (toNumericFormulaValue(results["shareholdersEquity"])); results["debtToEquity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["debtToEquity"] = Number.NaN; }
  return results;
}


export function calculateDebt_to_equity_ratio_calculator(input: Debt_to_equity_ratio_calculatorInput): Debt_to_equity_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["debtToEquity"]);
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


export interface Debt_to_equity_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
