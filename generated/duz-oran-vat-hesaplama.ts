// Auto-generated from duz-oran-vat-hesaplama-schema.json
import * as z from 'zod';

export interface Duz_oran_vat_hesaplamaInput {
  baseAmount: number;
  exchangeRate: number;
  dataConfidence?: number;
}

export const Duz_oran_vat_hesaplamaInputSchema = z.object({
  baseAmount: z.number().min(0).default(100),
  exchangeRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Duz_oran_vat_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseAmount * (1 + input.exchangeRate/100) - input.baseAmount * input.exchangeRate / 10000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.baseAmount * (1 + input.exchangeRate/100) - input.baseAmount * input.exchangeRate / 10000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateDuz_oran_vat_hesaplama(input: Duz_oran_vat_hesaplamaInput): Duz_oran_vat_hesaplamaOutput {
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


export interface Duz_oran_vat_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Duz_oran_vat_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "currency",
  breakdownKeys: ["result"],
} as const;

