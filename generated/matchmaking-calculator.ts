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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Matchmaking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.criterion1_score_a * input.criterion1_score_b * input.criterion2_score_a * input.criterion2_score_b; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.criterion1_score_a * input.criterion1_score_b * input.criterion2_score_a * input.criterion2_score_b * (input.criterion3_score_a * input.criterion3_score_b * input.criterion4_score_a * input.criterion4_score_b); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.criterion3_score_a * input.criterion3_score_b * input.criterion4_score_a * input.criterion4_score_b; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMatchmaking_calculator(input: Matchmaking_calculatorInput): Matchmaking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
