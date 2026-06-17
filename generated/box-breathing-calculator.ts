// @ts-nocheck
// Auto-generated from box-breathing-calculator-schema.json
import * as z from 'zod';

export interface Box_breathing_calculatorInput {
  inhaleTime: number;
  holdTime1: number;
  exhaleTime: number;
  holdTime2: number;
  numCycles: number;
}

export const Box_breathing_calculatorInputSchema = z.object({
  inhaleTime: z.number().default(4),
  holdTime1: z.number().default(4),
  exhaleTime: z.number().default(4),
  holdTime2: z.number().default(4),
  numCycles: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Box_breathing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.inhaleTime + input.holdTime1 + input.exhaleTime + input.holdTime2; results["cycleDuration"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cycleDuration"] = 0; }
  try { const v = (asFormulaNumber(results["cycleDuration"])) * input.numCycles; results["totalDuration"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDuration"] = 0; }
  try { const v = 60 / (asFormulaNumber(results["cycleDuration"])); results["breathsPerMinute"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breathsPerMinute"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBox_breathing_calculator(input: Box_breathing_calculatorInput): Box_breathing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDuration"]);
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


export interface Box_breathing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
