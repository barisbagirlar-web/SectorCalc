// Auto-generated from win-rate-calculator-schema.json
import * as z from 'zod';

export interface Win_rate_calculatorInput {
  totalOpportunities: number;
  wonOpportunities: number;
  pendingOpportunities: number;
  targetWinRate: number;
  dataConfidence?: number;
}

export const Win_rate_calculatorInputSchema = z.object({
  totalOpportunities: z.number().default(100),
  wonOpportunities: z.number().default(25),
  pendingOpportunities: z.number().default(20),
  targetWinRate: z.number().default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Win_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wonOpportunities / (input.totalOpportunities - input.pendingOpportunities)) * 100; results["winRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["winRate"] = Number.NaN; }
  try { const v = input.wonOpportunities; results["winCount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["winCount"] = Number.NaN; }
  try { const v = input.totalOpportunities - input.pendingOpportunities - input.wonOpportunities; results["lossCount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossCount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["winRate"])) - input.targetWinRate; results["gap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gap"] = Number.NaN; }
  return results;
}


export function calculateWin_rate_calculator(input: Win_rate_calculatorInput): Win_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["winRate"]);
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


export interface Win_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
