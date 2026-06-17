// @ts-nocheck
// Auto-generated from work-study-calculator-schema.json
import * as z from 'zod';

export interface Work_study_calculatorInput {
  observedTime: number;
  ratingFactor: number;
  allowanceFactor: number;
  cycleCount: number;
  standardDeviation: number;
  precision: number;
  zScore: number;
}

export const Work_study_calculatorInputSchema = z.object({
  observedTime: z.number().default(1),
  ratingFactor: z.number().default(100),
  allowanceFactor: z.number().default(15),
  cycleCount: z.number().default(5),
  standardDeviation: z.number().default(0.1),
  precision: z.number().default(5),
  zScore: z.number().default(1.96),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Work_study_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.observedTime * (input.ratingFactor / 100); results["normalTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalTime"] = 0; }
  try { const v = (asFormulaNumber(results["normalTime"])) * (1 + input.allowanceFactor / 100); results["standardTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["standardTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWork_study_calculator(input: Work_study_calculatorInput): Work_study_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["standardTime"]);
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


export interface Work_study_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
