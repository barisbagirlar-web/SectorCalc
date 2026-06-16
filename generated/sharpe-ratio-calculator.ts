// Auto-generated from sharpe-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sharpe_ratio_calculatorInput {
  portfolioReturn: number;
  riskFreeRate: number;
  dailyStdDev: number;
  tradingDays: number;
}

export const Sharpe_ratio_calculatorInputSchema = z.object({
  portfolioReturn: z.number().default(10),
  riskFreeRate: z.number().default(2),
  dailyStdDev: z.number().default(1.5),
  tradingDays: z.number().default(252),
});

function evaluateAllFormulas(input: Sharpe_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.portfolioReturn - input.riskFreeRate; results["excessReturn"] = Number.isFinite(v) ? v : 0; } catch { results["excessReturn"] = 0; }
  try { const v = input.dailyStdDev * Math.sqrt(input.tradingDays); results["annualizedStdDev"] = Number.isFinite(v) ? v : 0; } catch { results["annualizedStdDev"] = 0; }
  try { const v = (results["excessReturn"] ?? 0) / (results["annualizedStdDev"] ?? 0); results["sharpeRatio"] = Number.isFinite(v) ? v : 0; } catch { results["sharpeRatio"] = 0; }
  return results;
}


export function calculateSharpe_ratio_calculator(input: Sharpe_ratio_calculatorInput): Sharpe_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sharpeRatio"] ?? 0;
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


export interface Sharpe_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
