// @ts-nocheck
// Auto-generated from cat-weight-calculator-schema.json
import * as z from 'zod';

export interface Cat_weight_calculatorInput {
  length: number;
  girth: number;
  breedFactor: number;
  sexFactor: number;
}

export const Cat_weight_calculatorInputSchema = z.object({
  length: z.number().default(30),
  girth: z.number().default(35),
  breedFactor: z.number().default(1),
  sexFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cat_weight_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.girth * input.girth; results["girthSquared"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["girthSquared"] = 0; }
  try { const v = (asFormulaNumber(results["girthSquared"])) * input.length; results["volume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (asFormulaNumber(results["volume"])) / 11800; results["baseWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = (asFormulaNumber(results["baseWeight"])) * input.breedFactor * input.sexFactor; results["adjustedWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCat_weight_calculator(input: Cat_weight_calculatorInput): Cat_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedWeight"]);
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


export interface Cat_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
