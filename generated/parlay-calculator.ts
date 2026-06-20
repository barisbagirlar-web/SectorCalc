// Auto-generated from parlay-calculator-schema.json
import * as z from 'zod';

export interface Parlay_calculatorInput {
  stake: number;
  odds1: number;
  odds2: number;
  odds3: number;
  odds4: number;
  odds5: number;
  dataConfidence?: number;
}

export const Parlay_calculatorInputSchema = z.object({
  stake: z.number().default(100),
  odds1: z.number().default(1),
  odds2: z.number().default(1),
  odds3: z.number().default(1),
  odds4: z.number().default(1),
  odds5: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Parlay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stake * input.odds1 * input.odds2 * input.odds3 * input.odds4 * input.odds5; results["totalPayout"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayout"] = Number.NaN; }
  try { const v = input.odds1 * input.odds2 * input.odds3 * input.odds4 * input.odds5; results["totalOdds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOdds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPayout"])) - input.stake; results["potentialProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["potentialProfit"] = Number.NaN; }
  return results;
}


export function calculateParlay_calculator(input: Parlay_calculatorInput): Parlay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPayout"]);
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


export interface Parlay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
