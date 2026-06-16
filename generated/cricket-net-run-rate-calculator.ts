// Auto-generated from cricket-net-run-rate-calculator-schema.json
import * as z from 'zod';

export interface Cricket_net_run_rate_calculatorInput {
  runsScored: number;
  oversFaced: number;
  runsConceded: number;
  oversBowled: number;
}

export const Cricket_net_run_rate_calculatorInputSchema = z.object({
  runsScored: z.number().default(0),
  oversFaced: z.number().default(0),
  runsConceded: z.number().default(0),
  oversBowled: z.number().default(0),
});

function evaluateAllFormulas(input: Cricket_net_run_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runsScored / (Math.floor(input.oversFaced) + (input.oversFaced - Math.floor(input.oversFaced)) * (10/6)); results["battingRunRate"] = Number.isFinite(v) ? v : 0; } catch { results["battingRunRate"] = 0; }
  try { const v = input.runsConceded / (Math.floor(input.oversBowled) + (input.oversBowled - Math.floor(input.oversBowled)) * (10/6)); results["bowlingRunRate"] = Number.isFinite(v) ? v : 0; } catch { results["bowlingRunRate"] = 0; }
  try { const v = (results["battingRunRate"] ?? 0) - (results["bowlingRunRate"] ?? 0); results["netRunRate"] = Number.isFinite(v) ? v : 0; } catch { results["netRunRate"] = 0; }
  return results;
}


export function calculateCricket_net_run_rate_calculator(input: Cricket_net_run_rate_calculatorInput): Cricket_net_run_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netRunRate"] ?? 0;
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


export interface Cricket_net_run_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
