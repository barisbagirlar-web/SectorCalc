// Auto-generated from wilcoxon-signed-rank-schema.json
import * as z from 'zod';

export interface Wilcoxon_signed_rankInput {
  before: number;
  after: number;
  alpha: number;
  hypothesis: number;
  dataConfidence?: number;
}

export const Wilcoxon_signed_rankInputSchema = z.object({
  before: z.number().default(0),
  after: z.number().default(0),
  alpha: z.number().default(0.05),
  hypothesis: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wilcoxon_signed_rankInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.after - input.before; results["differences"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["differences"] = 0; }
  try { const v = input.after - input.before; results["differences_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["differences_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWilcoxon_signed_rank(input: Wilcoxon_signed_rankInput): Wilcoxon_signed_rankOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["differences"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
