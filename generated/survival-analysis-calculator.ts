// Auto-generated from survival-analysis-calculator-schema.json
import * as z from 'zod';

export interface Survival_analysis_calculatorInput {
  failureRate: number;
  time: number;
  targetSurvivalProb: number;
  observedFailures: number;
  totalTestTime: number;
  dataConfidence?: number;
}

export const Survival_analysis_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.001),
  time: z.number().default(1000),
  targetSurvivalProb: z.number().default(0.9),
  observedFailures: z.number().default(0),
  totalTestTime: z.number().default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Survival_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.failureRate) / (input.time + input.targetSurvivalProb + input.observedFailures + input.totalTestTime) * 100; results["hazardRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hazardRate"] = Number.NaN; }
  try { const v = (input.failureRate) * (input.time) * (input.targetSurvivalProb); results["cumulativeHazard"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cumulativeHazard"] = Number.NaN; }
  try { const v = ((input.failureRate) + (input.time) + (input.targetSurvivalProb)) / 3; results["meanTimeToFailure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meanTimeToFailure"] = Number.NaN; }
  return results;
}


export function calculateSurvival_analysis_calculator(input: Survival_analysis_calculatorInput): Survival_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanTimeToFailure"]);
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


export interface Survival_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
