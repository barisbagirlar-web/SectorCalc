// Auto-generated from tabata-calculator-schema.json
import * as z from 'zod';

export interface Tabata_calculatorInput {
  workDurationSec: number;
  restDurationSec: number;
  numCycles: number;
  numRounds: number;
  restBetweenRoundsSec: number;
}

export const Tabata_calculatorInputSchema = z.object({
  workDurationSec: z.number().default(20),
  restDurationSec: z.number().default(10),
  numCycles: z.number().default(8),
  numRounds: z.number().default(1),
  restBetweenRoundsSec: z.number().default(60),
});

function evaluateAllFormulas(input: Tabata_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workDurationSec * input.numCycles * input.numRounds; results["totalWorkSec"] = Number.isFinite(v) ? v : 0; } catch { results["totalWorkSec"] = 0; }
  try { const v = input.restDurationSec * input.numCycles * input.numRounds; results["totalRestSec"] = Number.isFinite(v) ? v : 0; } catch { results["totalRestSec"] = 0; }
  try { const v = (input.numRounds - 1) * input.restBetweenRoundsSec; results["totalRestBetweenRoundsSec"] = Number.isFinite(v) ? v : 0; } catch { results["totalRestBetweenRoundsSec"] = 0; }
  try { const v = (results["totalWorkSec"] ?? 0) + (results["totalRestSec"] ?? 0) + (results["totalRestBetweenRoundsSec"] ?? 0); results["totalTimeSec"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeSec"] = 0; }
  try { const v = (results["totalTimeSec"] ?? 0) / 60; results["totalTimeMin"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeMin"] = 0; }
  try { const v = ((results["totalWorkSec"] ?? 0) / (results["totalTimeSec"] ?? 0)) * 100; results["workPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["workPercentage"] = 0; }
  try { const v = ((results["totalRestSec"] ?? 0) / (results["totalTimeSec"] ?? 0)) * 100; results["restPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["restPercentage"] = 0; }
  return results;
}


export function calculateTabata_calculator(input: Tabata_calculatorInput): Tabata_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Tabata_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
