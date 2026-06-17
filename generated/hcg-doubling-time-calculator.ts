// @ts-nocheck
// Auto-generated from hcg-doubling-time-calculator-schema.json
import * as z from 'zod';

export interface Hcg_doubling_time_calculatorInput {
  hcg1: number;
  hcg2: number;
  timeInterval: number;
}

export const Hcg_doubling_time_calculatorInputSchema = z.object({
  hcg1: z.number().default(100),
  hcg2: z.number().default(200),
  timeInterval: z.number().default(48),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hcg_doubling_time_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.hcg2 / input.hcg1; results["growthRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["growthRate"] = 0; }
  try { const v = input.hcg2 / input.hcg1; results["growthRate_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["growthRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHcg_doubling_time_calculator(input: Hcg_doubling_time_calculatorInput): Hcg_doubling_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["growthRate_aux"]);
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


export interface Hcg_doubling_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
