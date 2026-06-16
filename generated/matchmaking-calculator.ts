// Auto-generated from matchmaking-calculator-schema.json
import * as z from 'zod';

export interface Matchmaking_calculatorInput {
  criterion1_score_a: number;
  criterion1_score_b: number;
  criterion2_score_a: number;
  criterion2_score_b: number;
  criterion3_score_a: number;
  criterion3_score_b: number;
  criterion4_score_a: number;
  criterion4_score_b: number;
}

export const Matchmaking_calculatorInputSchema = z.object({
  criterion1_score_a: z.number().default(50),
  criterion1_score_b: z.number().default(50),
  criterion2_score_a: z.number().default(50),
  criterion2_score_b: z.number().default(50),
  criterion3_score_a: z.number().default(50),
  criterion3_score_b: z.number().default(50),
  criterion4_score_a: z.number().default(50),
  criterion4_score_b: z.number().default(50),
});

function evaluateAllFormulas(input: Matchmaking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - Math.abs(input.criterion1_score_a - input.criterion1_score_b) / 100; results["match1"] = Number.isFinite(v) ? v : 0; } catch { results["match1"] = 0; }
  try { const v = 1 - Math.abs(input.criterion2_score_a - input.criterion2_score_b) / 100; results["match2"] = Number.isFinite(v) ? v : 0; } catch { results["match2"] = 0; }
  try { const v = 1 - Math.abs(input.criterion3_score_a - input.criterion3_score_b) / 100; results["match3"] = Number.isFinite(v) ? v : 0; } catch { results["match3"] = 0; }
  try { const v = 1 - Math.abs(input.criterion4_score_a - input.criterion4_score_b) / 100; results["match4"] = Number.isFinite(v) ? v : 0; } catch { results["match4"] = 0; }
  try { const v = ((results["match1"] ?? 0) + (results["match2"] ?? 0) + (results["match3"] ?? 0) + (results["match4"] ?? 0)) / 4 * 100; results["totalMatchScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalMatchScore"] = 0; }
  return results;
}


export function calculateMatchmaking_calculator(input: Matchmaking_calculatorInput): Matchmaking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMatchScore"] ?? 0;
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


export interface Matchmaking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
