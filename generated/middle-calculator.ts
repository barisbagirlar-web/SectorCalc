// @ts-nocheck
// Auto-generated from middle-calculator-schema.json
import * as z from 'zod';

export interface Middle_calculatorInput {
  input1: number;
  input2: number;
  input3: number;
  input4: number;
  input5: number;
}

export const Middle_calculatorInputSchema = z.object({
  input1: z.number().default(0),
  input2: z.number().default(0),
  input3: z.number().default(0),
  input4: z.number().default(0),
  input5: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Middle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Number(input.input1) + Number(input.input2) + Number(input.input3) + Number(input.input4) + Number(input.input5); results["sum"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sum"] = 0; }
  try { const v = (asFormulaNumber(results["sum"])) / 5; results["average"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["average"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMiddle_calculator(input: Middle_calculatorInput): Middle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["average"]);
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


export interface Middle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
