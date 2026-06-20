// Auto-generated from chi-kare-hesaplama-schema.json
import * as z from 'zod';

export interface Chi_kare_hesaplamaInput {
  revenueAmount: number;
  costAmount: number;
  dataConfidence?: number;
}

export const Chi_kare_hesaplamaInputSchema = z.object({
  revenueAmount: z.number().min(0).default(100),
  costAmount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chi_kare_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.revenueAmount - input.costAmount) / Math.sqrt((input.revenueAmount + input.costAmount) / 2 + 1) * 10 + 50; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = (input.revenueAmount - input.costAmount) / Math.sqrt((input.revenueAmount + input.costAmount) / 2 + 1) * 10 + 50; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateChi_kare_hesaplama(input: Chi_kare_hesaplamaInput): Chi_kare_hesaplamaOutput {
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
    unit: "currency",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Chi_kare_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Chi_kare_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

