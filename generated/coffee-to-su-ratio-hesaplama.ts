// Auto-generated from coffee-to-su-ratio-hesaplama-schema.json
import * as z from 'zod';

export interface Coffee_to_su_ratio_hesaplamaInput {
  baseAmount: number;
  dataConfidence?: number;
}

export const Coffee_to_su_ratio_hesaplamaInputSchema = z.object({
  baseAmount: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Coffee_to_su_ratio_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseAmount * 1.0 + Math.log(input.baseAmount + 1) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.baseAmount * 1.0 + Math.log(input.baseAmount + 1) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCoffee_to_su_ratio_hesaplama(input: Coffee_to_su_ratio_hesaplamaInput): Coffee_to_su_ratio_hesaplamaOutput {
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


export interface Coffee_to_su_ratio_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Coffee_to_su_ratio_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

