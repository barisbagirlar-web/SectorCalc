// @ts-nocheck
// Auto-generated from wilcoxon-signed-rank-schema.json
import * as z from 'zod';

export interface Wilcoxon_signed_rankInput {
  before: number;
  after: number;
  alpha: number;
  hypothesis: number;
}

export const Wilcoxon_signed_rankInputSchema = z.object({
  before: z.number().default(0),
  after: z.number().default(0),
  alpha: z.number().default(0.05),
  hypothesis: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wilcoxon_signed_rankInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.after - input.before; results["differences"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["differences"] = 0; }
  try { const v = input.after - input.before; results["differences_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["differences_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWilcoxon_signed_rank(input: Wilcoxon_signed_rankInput): Wilcoxon_signed_rankOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["differences"]);
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


export interface Wilcoxon_signed_rankOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
