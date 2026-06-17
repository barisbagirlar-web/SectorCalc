// @ts-nocheck
// Auto-generated from column-load-calculator-schema.json
import * as z from 'zod';

export interface Column_load_calculatorInput {
  length: number;
  area: number;
  inertia: number;
  elasticModulus: number;
  yieldStrength: number;
  effectiveLengthFactor: number;
  safetyFactor: number;
}

export const Column_load_calculatorInputSchema = z.object({
  length: z.number().default(3000),
  area: z.number().default(5000),
  inertia: z.number().default(1000000),
  elasticModulus: z.number().default(200),
  yieldStrength: z.number().default(250),
  effectiveLengthFactor: z.number().default(1),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Column_load_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (Math.PI**2 * input.elasticModulus * 1000 * input.inertia) / (input.effectiveLengthFactor*input.length)**2; results["criticalBucklingLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["criticalBucklingLoad"] = 0; }
  try { const v = input.area*input.yieldStrength; results["yieldLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yieldLoad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateColumn_load_calculator(input: Column_load_calculatorInput): Column_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yieldLoad"]);
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


export interface Column_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
