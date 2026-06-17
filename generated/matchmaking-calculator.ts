// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Matchmaking_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.criterion1_score_a + input.criterion1_score_b + input.criterion2_score_a; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.criterion1_score_a + input.criterion1_score_b + input.criterion2_score_a; results["result_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMatchmaking_calculator(input: Matchmaking_calculatorInput): Matchmaking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Matchmaking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
