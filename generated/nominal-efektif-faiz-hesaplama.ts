// Auto-generated from nominal-efektif-faiz-hesaplama-schema.json
import * as z from 'zod';

export interface Nominal_efektif_faiz_hesaplamaInput {
  nominal: number;
  siklik: number;
  dataConfidence?: number;
}

export const Nominal_efektif_faiz_hesaplamaInputSchema = z.object({
  nominal: z.number().min(0).default(12),
  siklik: z.number().min(1).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nominal_efektif_faiz_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.pow(1 + (input.nominal / 100) / Math.max(1, input.siklik), input.siklik) - 1) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNominal_efektif_faiz_hesaplama(input: Nominal_efektif_faiz_hesaplamaInput): Nominal_efektif_faiz_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Nominal_efektif_faiz_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Nominal_efektif_faiz_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

