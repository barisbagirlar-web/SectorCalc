// Auto-generated from yatirim-hesaplama-schema.json
import * as z from 'zod';

export interface Yatirim_hesaplamaInput {
  investment: number;
  returnPct: number;
  dataConfidence?: number;
}

export const Yatirim_hesaplamaInputSchema = z.object({
  investment: z.number().min(0).default(10000),
  returnPct: z.number().min(-100).max(10000).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yatirim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investment * (1 + input.returnPct/100); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.investment * (1 + input.returnPct/100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateYatirim_hesaplama(input: Yatirim_hesaplamaInput): Yatirim_hesaplamaOutput {
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


export interface Yatirim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yatirim_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["result"],
} as const;

