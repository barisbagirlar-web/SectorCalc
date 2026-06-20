// Auto-generated from percentage-1rm-hesaplama-schema.json
import * as z from 'zod';

export interface Percentage_1rm_hesaplamaInput {
  weightLifted: number;
  param2: number;
  dataConfidence?: number;
}

export const Percentage_1rm_hesaplamaInputSchema = z.object({
  weightLifted: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percentage_1rm_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightLifted / input.param2 * 100 + Math.sqrt(input.weightLifted * input.param2) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.weightLifted / input.param2 * 100 + Math.sqrt(input.weightLifted * input.param2) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePercentage_1rm_hesaplama(input: Percentage_1rm_hesaplamaInput): Percentage_1rm_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Percentage_1rm_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Percentage_1rm_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

