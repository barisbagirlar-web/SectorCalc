// @ts-nocheck
// Auto-generated from stair-rise-run-calculator-schema.json
import * as z from 'zod';

export interface Stair_rise_run_calculatorInput {
  totalRise: number;
  totalRun: number;
  maxRiserHeight: number;
  minTreadDepth: number;
  desiredRise: number;
  nosing: number;
}

export const Stair_rise_run_calculatorInputSchema = z.object({
  totalRise: z.number().default(2800),
  totalRun: z.number().default(3500),
  maxRiserHeight: z.number().default(190),
  minTreadDepth: z.number().default(250),
  desiredRise: z.number().default(175),
  nosing: z.number().default(25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stair_rise_run_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalRise + input.totalRun + input.maxRiserHeight; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.totalRise + input.totalRun + input.maxRiserHeight; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStair_rise_run_calculator(input: Stair_rise_run_calculatorInput): Stair_rise_run_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Stair_rise_run_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
