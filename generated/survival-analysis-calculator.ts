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

function evaluateAllFormulas(input: Survival_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.exp(-input.failureRate * input.time); results["survivalProbability"] = Number.isFinite(v) ? v : 0; } catch { results["survivalProbability"] = 0; }
  try { const v = input.failureRate; results["hazardRate"] = Number.isFinite(v) ? v : 0; } catch { results["hazardRate"] = 0; }
  try { const v = input.failureRate * input.time; results["cumulativeHazard"] = Number.isFinite(v) ? v : 0; } catch { results["cumulativeHazard"] = 0; }
  try { const v = 1 / input.failureRate; results["meanTimeToFailure"] = Number.isFinite(v) ? v : 0; } catch { results["meanTimeToFailure"] = 0; }
  try { const v = -Math.log(input.targetSurvivalProb) / input.failureRate; results["requiredTimeForTargetSurvival"] = Number.isFinite(v) ? v : 0; } catch { results["requiredTimeForTargetSurvival"] = 0; }
  try { const v = -Math.log(0.9) / input.failureRate; results["b10Life"] = Number.isFinite(v) ? v : 0; } catch { results["b10Life"] = 0; }
  return results;
}


export function calculateSurvival_analysis_calculator(input: Survival_analysis_calculatorInput): Survival_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["survivalProbability"] ?? 0;
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


export interface Survival_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
