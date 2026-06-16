// Auto-generated from gate-score-calculator-schema.json
import * as z from 'zod';

export interface Gate_score_calculatorInput {
  scoreG: number;
  scoreA: number;
  scoreT: number;
  scoreE: number;
  weightG: number;
  weightA: number;
  weightT: number;
  weightE: number;
}

export const Gate_score_calculatorInputSchema = z.object({
  scoreG: z.number().default(0),
  scoreA: z.number().default(0),
  scoreT: z.number().default(0),
  scoreE: z.number().default(0),
  weightG: z.number().default(25),
  weightA: z.number().default(25),
  weightT: z.number().default(25),
  weightE: z.number().default(25),
});

function evaluateAllFormulas(input: Gate_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightG + input.weightA + input.weightT + input.weightE; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (input.scoreG * input.weightG + input.scoreA * input.weightA + input.scoreT * input.weightT + input.scoreE * input.weightE) / (input.weightG + input.weightA + input.weightT + input.weightE); results["overallScore"] = Number.isFinite(v) ? v : 0; } catch { results["overallScore"] = 0; }
  try { const v = (input.scoreG * input.weightG) / (input.weightG + input.weightA + input.weightT + input.weightE); results["gContribution"] = Number.isFinite(v) ? v : 0; } catch { results["gContribution"] = 0; }
  try { const v = (input.scoreA * input.weightA) / (input.weightG + input.weightA + input.weightT + input.weightE); results["aContribution"] = Number.isFinite(v) ? v : 0; } catch { results["aContribution"] = 0; }
  try { const v = (input.scoreT * input.weightT) / (input.weightG + input.weightA + input.weightT + input.weightE); results["tContribution"] = Number.isFinite(v) ? v : 0; } catch { results["tContribution"] = 0; }
  try { const v = (input.scoreE * input.weightE) / (input.weightG + input.weightA + input.weightT + input.weightE); results["eContribution"] = Number.isFinite(v) ? v : 0; } catch { results["eContribution"] = 0; }
  return results;
}


export function calculateGate_score_calculator(input: Gate_score_calculatorInput): Gate_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallScore"] ?? 0;
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


export interface Gate_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
