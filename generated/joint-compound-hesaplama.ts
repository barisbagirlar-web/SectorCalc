// Auto-generated from joint-compound-hesaplama-schema.json
import * as z from 'zod';

export interface Joint_compound_hesaplamaInput {
  principal: number;
  rate: number;
  periods: number;
  dataConfidence?: number;
}

export const Joint_compound_hesaplamaInputSchema = z.object({
  principal: z.number().min(0).max(1000000000).default(10000),
  rate: z.number().min(0).max(100).default(5),
  periods: z.number().min(1).max(50).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Joint_compound_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * Math.pow(1 + input.rate/100, input.periods); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.principal * Math.pow(1 + input.rate/100, input.periods); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateJoint_compound_hesaplama(input: Joint_compound_hesaplamaInput): Joint_compound_hesaplamaOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Joint_compound_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Joint_compound_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["result"],
} as const;

