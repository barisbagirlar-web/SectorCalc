// Auto-generated from dividend-payout-ratio-calculator-schema.json
import * as z from 'zod';

export interface Dividend_payout_ratio_calculatorInput {
  dividendsPaid: number;
  netIncome: number;
  dividendsPerShare: number;
  earningsPerShare: number;
}

export const Dividend_payout_ratio_calculatorInputSchema = z.object({
  dividendsPaid: z.number().default(1000000),
  netIncome: z.number().default(5000000),
  dividendsPerShare: z.number().default(2),
  earningsPerShare: z.number().default(5),
});

function evaluateAllFormulas(input: Dividend_payout_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dividendsPaid / input.netIncome) * 100; results["dividendPayoutRatioPercent"] = Number.isFinite(v) ? v : 0; } catch { results["dividendPayoutRatioPercent"] = 0; }
  try { const v = input.dividendsPaid / input.netIncome; results["dividendPayoutRatioDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["dividendPayoutRatioDecimal"] = 0; }
  try { const v = (1 - (input.dividendsPaid / input.netIncome)) * 100; results["retentionRatioPercent"] = Number.isFinite(v) ? v : 0; } catch { results["retentionRatioPercent"] = 0; }
  return results;
}


export function calculateDividend_payout_ratio_calculator(input: Dividend_payout_ratio_calculatorInput): Dividend_payout_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dividendPayoutRatioPercent"] ?? 0;
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


export interface Dividend_payout_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
