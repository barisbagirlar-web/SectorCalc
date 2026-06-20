// Auto-generated from variance-hesaplama-schema.json
import * as z from 'zod';

export interface Variance_hesaplamaInput {
  dataSet: number;
  sampleSize: number;
  dataConfidence?: number;
}

export const Variance_hesaplamaInputSchema = z.object({
  dataSet: z.number().min(0).default(100),
  sampleSize: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Variance_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dataSet - input.sampleSize) / Math.sqrt((input.dataSet + input.sampleSize) / 2 + 1) * 10 + 50; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = (input.dataSet - input.sampleSize) / Math.sqrt((input.dataSet + input.sampleSize) / 2 + 1) * 10 + 50; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateVariance_hesaplama(input: Variance_hesaplamaInput): Variance_hesaplamaOutput {
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
    unit: "n",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Variance_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Variance_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "n",
  breakdownKeys: ["result"],
} as const;

