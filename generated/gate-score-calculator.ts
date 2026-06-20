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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gate_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightG + input.weightA + input.weightT + input.weightE; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = (input.scoreG * input.weightG + input.scoreA * input.weightA + input.scoreT * input.weightT + input.scoreE * input.weightE) / (input.weightG + input.weightA + input.weightT + input.weightE); results["overallScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallScore"] = Number.NaN; }
  try { const v = (input.scoreG * input.weightG) / (input.weightG + input.weightA + input.weightT + input.weightE); results["gContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gContribution"] = Number.NaN; }
  try { const v = (input.scoreA * input.weightA) / (input.weightG + input.weightA + input.weightT + input.weightE); results["aContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aContribution"] = Number.NaN; }
  try { const v = (input.scoreT * input.weightT) / (input.weightG + input.weightA + input.weightT + input.weightE); results["tContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tContribution"] = Number.NaN; }
  try { const v = (input.scoreE * input.weightE) / (input.weightG + input.weightA + input.weightT + input.weightE); results["eContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eContribution"] = Number.NaN; }
  return results;
}


export function calculateGate_score_calculator(input: Gate_score_calculatorInput): Gate_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
