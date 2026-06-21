// Auto-generated from eva-ekonomik-katma-deger-hesaplama-schema.json
import * as z from 'zod';

export interface Eva_ekonomik_katma_deger_hesaplamaInput {
  nopat: number;
  sermaye: number;
  wacc: number;
  dataConfidence?: number;
}

export const Eva_ekonomik_katma_deger_hesaplamaInputSchema = z.object({
  nopat: z.number().min(0).default(200000),
  sermaye: z.number().min(0).default(1500000),
  wacc: z.number().min(0).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Eva_ekonomik_katma_deger_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nopat - (input.sermaye * input.wacc / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEva_ekonomik_katma_deger_hesaplama(input: Eva_ekonomik_katma_deger_hesaplamaInput): Eva_ekonomik_katma_deger_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Eva_ekonomik_katma_deger_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Eva_ekonomik_katma_deger_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

