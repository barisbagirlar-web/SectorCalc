// Auto-generated from dutching-calculator-schema.json
import * as z from 'zod';

export interface Dutching_calculatorInput {
  totalStake: number;
  oddsA: number;
  oddsB: number;
  oddsC: number;
  oddsD: number;
}

export const Dutching_calculatorInputSchema = z.object({
  totalStake: z.number().default(100),
  oddsA: z.number().default(2),
  oddsB: z.number().default(2),
  oddsC: z.number().default(2),
  oddsD: z.number().default(2),
});

function evaluateAllFormulas(input: Dutching_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalStake / (1/input.oddsA + 1/input.oddsB + 1/input.oddsC + 1/input.oddsD) - input.totalStake; results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = (input.totalStake * (1/input.oddsA)) / (1/input.oddsA + 1/input.oddsB + 1/input.oddsC + 1/input.oddsD); results["stakeA"] = Number.isFinite(v) ? v : 0; } catch { results["stakeA"] = 0; }
  try { const v = (input.totalStake * (1/input.oddsB)) / (1/input.oddsA + 1/input.oddsB + 1/input.oddsC + 1/input.oddsD); results["stakeB"] = Number.isFinite(v) ? v : 0; } catch { results["stakeB"] = 0; }
  try { const v = (input.totalStake * (1/input.oddsC)) / (1/input.oddsA + 1/input.oddsB + 1/input.oddsC + 1/input.oddsD); results["stakeC"] = Number.isFinite(v) ? v : 0; } catch { results["stakeC"] = 0; }
  try { const v = (input.totalStake * (1/input.oddsD)) / (1/input.oddsA + 1/input.oddsB + 1/input.oddsC + 1/input.oddsD); results["stakeD"] = Number.isFinite(v) ? v : 0; } catch { results["stakeD"] = 0; }
  return results;
}


export function calculateDutching_calculator(input: Dutching_calculatorInput): Dutching_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["profit"] ?? 0;
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


export interface Dutching_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
