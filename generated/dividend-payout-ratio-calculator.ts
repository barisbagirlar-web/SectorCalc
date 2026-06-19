// Auto-generated from dividend-payout-ratio-calculator-schema.json
import * as z from 'zod';

export interface Dividend_payout_ratio_calculatorInput {
  dividendsPaid: number;
  netIncome: number;
  dividendsPerShare: number;
  earningsPerShare: number;
  dataConfidence?: number;
}

export const Dividend_payout_ratio_calculatorInputSchema = z.object({
  dividendsPaid: z.number().default(1000000),
  netIncome: z.number().default(5000000),
  dividendsPerShare: z.number().default(2),
  earningsPerShare: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dividend_payout_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dividendsPaid / input.netIncome) * 100; results["dividendPayoutRatioPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dividendPayoutRatioPercent"] = 0; }
  try { const v = input.dividendsPaid / input.netIncome; results["dividendPayoutRatioDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dividendPayoutRatioDecimal"] = 0; }
  try { const v = (1 - (input.dividendsPaid / input.netIncome)) * 100; results["retentionRatioPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["retentionRatioPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDividend_payout_ratio_calculator(input: Dividend_payout_ratio_calculatorInput): Dividend_payout_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dividendPayoutRatioPercent"]);
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


export interface Dividend_payout_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
