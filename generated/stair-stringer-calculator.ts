// Auto-generated from stair-stringer-calculator-schema.json
import * as z from 'zod';

export interface Stair_stringer_calculatorInput {
  totalRise: number;
  numberRisers: number;
  treadDepth: number;
  stringerWidth: number;
  nosing: number;
  dataConfidence?: number;
}

export const Stair_stringer_calculatorInputSchema = z.object({
  totalRise: z.number().default(2800),
  numberRisers: z.number().default(15),
  treadDepth: z.number().default(280),
  stringerWidth: z.number().default(286),
  nosing: z.number().default(25),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stair_stringer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise / input.numberRisers; results["riserHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riserHeight"] = 0; }
  try { const v = (input.numberRisers - 1) * input.treadDepth; results["totalRun"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = input.numberRisers - 1; results["numberTreads"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberTreads"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStair_stringer_calculator(input: Stair_stringer_calculatorInput): Stair_stringer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["numberTreads"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Stair_stringer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
