// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gate_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weightG + input.weightA + input.weightT + input.weightE; results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (input.scoreG * input.weightG + input.scoreA * input.weightA + input.scoreT * input.weightT + input.scoreE * input.weightE) / (input.weightG + input.weightA + input.weightT + input.weightE); results["overallScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overallScore"] = 0; }
  try { const v = (input.scoreG * input.weightG) / (input.weightG + input.weightA + input.weightT + input.weightE); results["gContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gContribution"] = 0; }
  try { const v = (input.scoreA * input.weightA) / (input.weightG + input.weightA + input.weightT + input.weightE); results["aContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["aContribution"] = 0; }
  try { const v = (input.scoreT * input.weightT) / (input.weightG + input.weightA + input.weightT + input.weightE); results["tContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tContribution"] = 0; }
  try { const v = (input.scoreE * input.weightE) / (input.weightG + input.weightA + input.weightT + input.weightE); results["eContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eContribution"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGate_score_calculator(input: Gate_score_calculatorInput): Gate_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallScore"]);
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


export interface Gate_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
