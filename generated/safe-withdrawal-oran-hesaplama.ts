// Auto-generated from safe-withdrawal-oran-hesaplama-schema.json
import * as z from 'zod';

export interface Safe_withdrawal_oran_hesaplamaInput {
  baseAmount: number;
  dataConfidence?: number;
}

export const Safe_withdrawal_oran_hesaplamaInputSchema = z.object({
  baseAmount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Safe_withdrawal_oran_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.baseAmount / 100, 2) * 100 + Math.sqrt(input.baseAmount) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = Math.pow(input.baseAmount / 100, 2) * 100 + Math.sqrt(input.baseAmount) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSafe_withdrawal_oran_hesaplama(input: Safe_withdrawal_oran_hesaplamaInput): Safe_withdrawal_oran_hesaplamaOutput {
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


export interface Safe_withdrawal_oran_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Safe_withdrawal_oran_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

