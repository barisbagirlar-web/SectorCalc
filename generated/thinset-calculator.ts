// @ts-nocheck
// Auto-generated from thinset-calculator-schema.json
import * as z from 'zod';

export interface Thinset_calculatorInput {
  area: number;
  notchSize: number;
  wasteFactor: number;
  bagWeight: number;
}

export const Thinset_calculatorInputSchema = z.object({
  area: z.number().default(10),
  notchSize: z.number().default(6),
  wasteFactor: z.number().default(5),
  bagWeight: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thinset_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.notchSize * 0.4 + 0.8; results["coverageRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["coverageRate"] = 0; }
  try { const v = input.area * (input.notchSize * 0.4 + 0.8) * (1 + input.wasteFactor/100); results["totalKgs"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalKgs"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateThinset_calculator(input: Thinset_calculatorInput): Thinset_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalKgs"]);
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


export interface Thinset_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
