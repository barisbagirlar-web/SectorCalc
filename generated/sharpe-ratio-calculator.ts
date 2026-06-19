// Auto-generated from sharpe-ratio-calculator-schema.json
import * as z from 'zod';

export interface Sharpe_ratio_calculatorInput {
  portfolioReturn: number;
  riskFreeRate: number;
  dailyStdDev: number;
  tradingDays: number;
  dataConfidence?: number;
}

export const Sharpe_ratio_calculatorInputSchema = z.object({
  portfolioReturn: z.number().default(10),
  riskFreeRate: z.number().default(2),
  dailyStdDev: z.number().default(1.5),
  tradingDays: z.number().default(252),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sharpe_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.portfolioReturn / 100) * (input.riskFreeRate / 100) * (input.dailyStdDev / 100) * input.tradingDays; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.portfolioReturn / 100) * (input.riskFreeRate / 100) * (input.dailyStdDev / 100) * input.tradingDays; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSharpe_ratio_calculator(input: Sharpe_ratio_calculatorInput): Sharpe_ratio_calculatorOutput {
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


export interface Sharpe_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
