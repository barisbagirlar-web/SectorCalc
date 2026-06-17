// @ts-nocheck
// Auto-generated from pipe-size-calculator-schema.json
import * as z from 'zod';

export interface Pipe_size_calculatorInput {
  flowRate: number;
  velocity: number;
  pressure: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
}

export const Pipe_size_calculatorInputSchema = z.object({
  flowRate: z.number().default(100),
  velocity: z.number().default(2),
  pressure: z.number().default(10),
  allowableStress: z.number().default(137.9),
  jointEfficiency: z.number().default(1),
  corrosionAllowance: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pipe_size_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.flowRate + input.velocity + input.pressure; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.flowRate + input.velocity + input.pressure; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePipe_size_calculator(input: Pipe_size_calculatorInput): Pipe_size_calculatorOutput {
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


export interface Pipe_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
