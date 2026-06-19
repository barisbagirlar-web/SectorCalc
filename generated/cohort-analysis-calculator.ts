// Auto-generated from cohort-analysis-calculator-schema.json
import * as z from 'zod';

export interface Cohort_analysis_calculatorInput {
  cohortASize: number;
  cohortBSize: number;
  retentionRateA: number;
  retentionRateB: number;
  periods: number;
  dataConfidence?: number;
}

export const Cohort_analysis_calculatorInputSchema = z.object({
  cohortASize: z.number().default(1000),
  cohortBSize: z.number().default(800),
  retentionRateA: z.number().default(80),
  retentionRateB: z.number().default(75),
  periods: z.number().default(12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cohort_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cohortASize * input.cohortBSize * input.retentionRateA * input.retentionRateB; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cohortASize * input.cohortBSize * input.retentionRateA * input.retentionRateB * (input.periods); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.periods; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCohort_analysis_calculator(input: Cohort_analysis_calculatorInput): Cohort_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cohort_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
