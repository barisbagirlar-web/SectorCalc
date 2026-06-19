// Auto-generated from gratitude-index-calculator-schema.json
import * as z from 'zod';

export interface Gratitude_index_calculatorInput {
  appreciation_freq: number;
  positive_feedback_ratio: number;
  team_morale_score: number;
  recognition_impact: number;
  gratitude_decay: number;
  baseline_productivity: number;
  dataConfidence?: number;
}

export const Gratitude_index_calculatorInputSchema = z.object({
  appreciation_freq: z.number().default(5),
  positive_feedback_ratio: z.number().default(70),
  team_morale_score: z.number().default(7),
  recognition_impact: z.number().default(15),
  gratitude_decay: z.number().default(0.1),
  baseline_productivity: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gratitude_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.appreciation_freq * input.positive_feedback_ratio * input.team_morale_score * input.recognition_impact; results["raw_gratitude_score"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["raw_gratitude_score"] = 0; }
  try { const v = input.appreciation_freq * input.positive_feedback_ratio * input.team_morale_score * input.recognition_impact; results["raw_gratitude_score_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["raw_gratitude_score_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGratitude_index_calculator(input: Gratitude_index_calculatorInput): Gratitude_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["raw_gratitude_score_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Gratitude_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
