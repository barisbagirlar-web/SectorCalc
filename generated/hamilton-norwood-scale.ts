// @ts-nocheck
// Auto-generated from hamilton-norwood-scale-schema.json
import * as z from 'zod';

export interface Hamilton_norwood_scaleInput {
  age: number;
  frontal_recession_mm: number;
  vertex_thinning_percent: number;
  temporal_thinning_percent: number;
  family_history_score: number;
  duration_years: number;
}

export const Hamilton_norwood_scaleInputSchema = z.object({
  age: z.number().default(30),
  frontal_recession_mm: z.number().default(10),
  vertex_thinning_percent: z.number().default(20),
  temporal_thinning_percent: z.number().default(10),
  family_history_score: z.number().default(1),
  duration_years: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hamilton_norwood_scaleInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.family_history_score; results["family_score"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["family_score"] = 0; }
  try { const v = input.family_history_score; results["family_score_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["family_score_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHamilton_norwood_scale(input: Hamilton_norwood_scaleInput): Hamilton_norwood_scaleOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["family_score_aux"]);
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


export interface Hamilton_norwood_scaleOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
