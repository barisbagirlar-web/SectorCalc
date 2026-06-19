// Auto-generated from cricket-run-rate-calculator-schema.json
import * as z from 'zod';

export interface Cricket_run_rate_calculatorInput {
  runsScored: number;
  oversFaced: number;
  targetRuns: number;
  totalOvers: number;
  dataConfidence?: number;
}

export const Cricket_run_rate_calculatorInputSchema = z.object({
  runsScored: z.number().default(0),
  oversFaced: z.number().default(0),
  targetRuns: z.number().default(0),
  totalOvers: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cricket_run_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runsScored * input.oversFaced * input.targetRuns * input.totalOvers; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.runsScored * input.oversFaced * input.targetRuns * input.totalOvers; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCricket_run_rate_calculator(input: Cricket_run_rate_calculatorInput): Cricket_run_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cricket_run_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
