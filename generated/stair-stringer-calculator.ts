// @ts-nocheck
// Auto-generated from stair-stringer-calculator-schema.json
import * as z from 'zod';

export interface Stair_stringer_calculatorInput {
  totalRise: number;
  numberRisers: number;
  treadDepth: number;
  stringerWidth: number;
  nosing: number;
}

export const Stair_stringer_calculatorInputSchema = z.object({
  totalRise: z.number().default(2800),
  numberRisers: z.number().default(15),
  treadDepth: z.number().default(280),
  stringerWidth: z.number().default(286),
  nosing: z.number().default(25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stair_stringer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalRise; results["riserHeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["riserHeight"] = 0; }
  try { const v = input.totalRise; results["totalRun"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = input.totalRise; results["stringerLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["stringerLength"] = 0; }
  try { const v = input.totalRise; results["angle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["angle"] = 0; }
  try { const v = input.totalRise; results["numberTreads"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["numberTreads"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStair_stringer_calculator(input: Stair_stringer_calculatorInput): Stair_stringer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["numberTreads"]);
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


export interface Stair_stringer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
