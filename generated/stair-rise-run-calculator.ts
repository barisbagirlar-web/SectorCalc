// Auto-generated from stair-rise-run-calculator-schema.json
import * as z from 'zod';

export interface Stair_rise_run_calculatorInput {
  totalRise: number;
  totalRun: number;
  maxRiserHeight: number;
  minTreadDepth: number;
  desiredRise: number;
  nosing: number;
  dataConfidence?: number;
}

export const Stair_rise_run_calculatorInputSchema = z.object({
  totalRise: z.number().default(2800),
  totalRun: z.number().default(3500),
  maxRiserHeight: z.number().default(190),
  minTreadDepth: z.number().default(250),
  desiredRise: z.number().default(175),
  nosing: z.number().default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stair_rise_run_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise * input.totalRun * input.maxRiserHeight * input.minTreadDepth; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.totalRise * input.totalRun * input.maxRiserHeight * input.minTreadDepth * (input.desiredRise * input.nosing); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.desiredRise * input.nosing; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateStair_rise_run_calculator(input: Stair_rise_run_calculatorInput): Stair_rise_run_calculatorOutput {
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


export interface Stair_rise_run_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
