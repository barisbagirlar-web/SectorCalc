// @ts-nocheck
// Auto-generated from parlay-calculator-schema.json
import * as z from 'zod';

export interface Parlay_calculatorInput {
  stake: number;
  odds1: number;
  odds2: number;
  odds3: number;
  odds4: number;
  odds5: number;
}

export const Parlay_calculatorInputSchema = z.object({
  stake: z.number().default(100),
  odds1: z.number().default(1),
  odds2: z.number().default(1),
  odds3: z.number().default(1),
  odds4: z.number().default(1),
  odds5: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Parlay_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.stake * input.odds1 * input.odds2 * input.odds3 * input.odds4 * input.odds5; results["totalPayout"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayout"] = 0; }
  try { const v = input.odds1 * input.odds2 * input.odds3 * input.odds4 * input.odds5; results["totalOdds"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalOdds"] = 0; }
  try { const v = (asFormulaNumber(results["totalPayout"])) - input.stake; results["potentialProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["potentialProfit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateParlay_calculator(input: Parlay_calculatorInput): Parlay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPayout"]);
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


export interface Parlay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
