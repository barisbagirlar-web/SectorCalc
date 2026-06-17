// @ts-nocheck
// Auto-generated from lbtt-calculator-scotland-schema.json
import * as z from 'zod';

export interface Lbtt_calculator_scotlandInput {
  purchasePrice: number;
  isFirstTimeBuyer: number;
  isAdditionalDwelling: number;
}

export const Lbtt_calculator_scotlandInputSchema = z.object({
  purchasePrice: z.number().default(0),
  isFirstTimeBuyer: z.number().default(0),
  isAdditionalDwelling: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lbtt_calculator_scotlandInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.purchasePrice + input.isFirstTimeBuyer + input.isAdditionalDwelling; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.purchasePrice + input.isFirstTimeBuyer + input.isAdditionalDwelling; results["result_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLbtt_calculator_scotland(input: Lbtt_calculator_scotlandInput): Lbtt_calculator_scotlandOutput {
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


export interface Lbtt_calculator_scotlandOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
