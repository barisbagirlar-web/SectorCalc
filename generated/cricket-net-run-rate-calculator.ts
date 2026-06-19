// Auto-generated from cricket-net-run-rate-calculator-schema.json
import * as z from 'zod';

export interface Cricket_net_run_rate_calculatorInput {
  runsScored: number;
  oversFaced: number;
  runsConceded: number;
  oversBowled: number;
  dataConfidence?: number;
}

export const Cricket_net_run_rate_calculatorInputSchema = z.object({
  runsScored: z.number().default(0),
  oversFaced: z.number().default(0),
  runsConceded: z.number().default(0),
  oversBowled: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cricket_net_run_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runsScored * input.oversFaced * input.runsConceded * input.oversBowled; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.runsScored * input.oversFaced * input.runsConceded * input.oversBowled; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCricket_net_run_rate_calculator(input: Cricket_net_run_rate_calculatorInput): Cricket_net_run_rate_calculatorOutput {
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


export interface Cricket_net_run_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
