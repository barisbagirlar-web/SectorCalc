// Auto-generated from w2-maas-hesaplama-schema.json
import * as z from 'zod';

export interface W2_maas_hesaplamaInput {
  annualIncome: number;
  dataConfidence?: number;
}

export const W2_maas_hesaplamaInputSchema = z.object({
  annualIncome: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: W2_maas_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualIncome * (1 + input.annualIncome/500) + Math.sqrt(input.annualIncome) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.annualIncome * (1 + input.annualIncome/500) + Math.sqrt(input.annualIncome) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateW2_maas_hesaplama(input: W2_maas_hesaplamaInput): W2_maas_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface W2_maas_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const W2_maas_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

