// @ts-nocheck
// Auto-generated from debt-to-equity-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_equity_ratio_calculatorInput {
  totalAssets: number;
  longTermDebt: number;
  currentLiabilities: number;
  otherLiabilities: number;
}

export const Debt_to_equity_ratio_calculatorInputSchema = z.object({
  totalAssets: z.number().default(200000),
  longTermDebt: z.number().default(40000),
  currentLiabilities: z.number().default(60000),
  otherLiabilities: z.number().default(10000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Debt_to_equity_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.longTermDebt + input.currentLiabilities + input.otherLiabilities) / (input.totalAssets - (input.longTermDebt + input.currentLiabilities + input.otherLiabilities)); results["debtToEquity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["debtToEquity"] = 0; }
  try { const v = input.longTermDebt + input.currentLiabilities + input.otherLiabilities; results["totalLiabilities"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLiabilities"] = 0; }
  try { const v = input.totalAssets - (input.longTermDebt + input.currentLiabilities + input.otherLiabilities); results["shareholdersEquity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shareholdersEquity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDebt_to_equity_ratio_calculator(input: Debt_to_equity_ratio_calculatorInput): Debt_to_equity_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["debtToEquity"]);
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


export interface Debt_to_equity_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
