// Auto-generated from cricket-run-rate-calculator-schema.json
import * as z from 'zod';

export interface Cricket_run_rate_calculatorInput {
  runsScored: number;
  oversFaced: number;
  targetRuns: number;
  totalOvers: number;
}

export const Cricket_run_rate_calculatorInputSchema = z.object({
  runsScored: z.number().default(0),
  oversFaced: z.number().default(0),
  targetRuns: z.number().default(0),
  totalOvers: z.number().default(20),
});

function evaluateAllFormulas(input: Cricket_run_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((Math.floor(input.oversFaced) * 6 + (input.oversFaced % 1) * 10) > 0 ? 6 * input.runsScored / (Math.floor(input.oversFaced) * 6 + (input.oversFaced % 1) * 10) : 0); results["currentRunRate"] = Number.isFinite(v) ? v : 0; } catch { results["currentRunRate"] = 0; }
  try { const v = ((Math.floor(input.totalOvers) * 6 + (input.totalOvers % 1) * 10 - (Math.floor(input.oversFaced) * 6 + (input.oversFaced % 1) * 10)) > 0 ? 6 * (input.targetRuns - input.runsScored) / (Math.floor(input.totalOvers) * 6 + (input.totalOvers % 1) * 10 - (Math.floor(input.oversFaced) * 6 + (input.oversFaced % 1) * 10)) : ((input.targetRuns - input.runsScored) > 0 ? 1e10 : 0)); results["requiredRunRate"] = Number.isFinite(v) ? v : 0; } catch { results["requiredRunRate"] = 0; }
  try { const v = Math.max(0, input.targetRuns - input.runsScored); results["runsRemaining"] = Number.isFinite(v) ? v : 0; } catch { results["runsRemaining"] = 0; }
  try { const v = Math.floor(Math.max(0, (Math.floor(input.totalOvers) * 6 + (input.totalOvers % 1) * 10) - (Math.floor(input.oversFaced) * 6 + (input.oversFaced % 1) * 10)) / 6) + (Math.max(0, (Math.floor(input.totalOvers) * 6 + (input.totalOvers % 1) * 10) - (Math.floor(input.oversFaced) * 6 + (input.oversFaced % 1) * 10)) % 6) / 10; results["oversRemaining"] = Number.isFinite(v) ? v : 0; } catch { results["oversRemaining"] = 0; }
  return results;
}


export function calculateCricket_run_rate_calculator(input: Cricket_run_rate_calculatorInput): Cricket_run_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredRunRate"] ?? 0;
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


export interface Cricket_run_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
