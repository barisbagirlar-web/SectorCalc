// @ts-nocheck
// Auto-generated from column-design-calculator-schema.json
import * as z from 'zod';

export interface Column_design_calculatorInput {
  P: number;
  L: number;
  E: number;
  I: number;
  A: number;
  Fy: number;
  SF: number;
}

export const Column_design_calculatorInputSchema = z.object({
  P: z.number().default(100),
  L: z.number().default(3),
  E: z.number().default(200),
  I: z.number().default(1000),
  A: z.number().default(50),
  Fy: z.number().default(250),
  SF: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Column_design_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI ** 2 * input.E * input.I / (100 * input.L ** 2); results["Math_PI____2___E___I____100___L____2_"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["Math_PI____2___E___I____100___L____2_"] = 0; }
  try { const v = input.A * input.Fy / (10 * input.SF); results["A___Fy____10___SF_"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["A___Fy____10___SF_"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateColumn_design_calculator(input: Column_design_calculatorInput): Column_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["A___Fy____10___SF_"]);
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


export interface Column_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
