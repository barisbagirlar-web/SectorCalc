// @ts-nocheck
// Auto-generated from radical-calculator-schema.json
import * as z from 'zod';

export interface Radical_calculatorInput {
  multiplier: number;
  radicand: number;
  index: number;
  addend: number;
}

export const Radical_calculatorInputSchema = z.object({
  multiplier: z.number().default(1),
  radicand: z.number().default(16),
  index: z.number().default(2),
  addend: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Radical_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.radicand ** (1/input.index); results["rootValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rootValue"] = 0; }
  try { const v = input.multiplier * (asFormulaNumber(results["rootValue"])); results["multiplied"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["multiplied"] = 0; }
  try { const v = (asFormulaNumber(results["multiplied"])) + input.addend; results["finalResult"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["finalResult"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRadical_calculator(input: Radical_calculatorInput): Radical_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalResult"]);
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


export interface Radical_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
