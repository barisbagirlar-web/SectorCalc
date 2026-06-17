// @ts-nocheck
// Auto-generated from survival-analysis-calculator-schema.json
import * as z from 'zod';

export interface Survival_analysis_calculatorInput {
  failureRate: number;
  time: number;
  targetSurvivalProb: number;
  observedFailures: number;
  totalTestTime: number;
}

export const Survival_analysis_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.001),
  time: z.number().default(1000),
  targetSurvivalProb: z.number().default(0.9),
  observedFailures: z.number().default(0),
  totalTestTime: z.number().default(1000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Survival_analysis_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.failureRate; results["hazardRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hazardRate"] = 0; }
  try { const v = input.failureRate * input.time; results["cumulativeHazard"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cumulativeHazard"] = 0; }
  try { const v = 1 / input.failureRate; results["meanTimeToFailure"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meanTimeToFailure"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSurvival_analysis_calculator(input: Survival_analysis_calculatorInput): Survival_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanTimeToFailure"]);
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


export interface Survival_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
