// Auto-generated from cohort-analysis-calculator-schema.json
import * as z from 'zod';

export interface Cohort_analysis_calculatorInput {
  cohortASize: number;
  cohortBSize: number;
  retentionRateA: number;
  retentionRateB: number;
  periods: number;
}

export const Cohort_analysis_calculatorInputSchema = z.object({
  cohortASize: z.number().default(1000),
  cohortBSize: z.number().default(800),
  retentionRateA: z.number().default(80),
  retentionRateB: z.number().default(75),
  periods: z.number().default(12),
});

function evaluateAllFormulas(input: Cohort_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cohortASize * Math.pow(input.retentionRateA / 100, input.periods); results["retainedA"] = Number.isFinite(v) ? v : 0; } catch { results["retainedA"] = 0; }
  try { const v = input.cohortBSize * Math.pow(input.retentionRateB / 100, input.periods); results["retainedB"] = Number.isFinite(v) ? v : 0; } catch { results["retainedB"] = 0; }
  try { const v = (results["retainedA"] ?? 0) + (results["retainedB"] ?? 0); results["totalRetained"] = Number.isFinite(v) ? v : 0; } catch { results["totalRetained"] = 0; }
  return results;
}


export function calculateCohort_analysis_calculator(input: Cohort_analysis_calculatorInput): Cohort_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRetained"] ?? 0;
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


export interface Cohort_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
