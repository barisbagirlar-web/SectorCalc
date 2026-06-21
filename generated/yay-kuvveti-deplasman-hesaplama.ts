// Auto-generated from yay-kuvveti-deplasman-hesaplama-schema.json
import * as z from 'zod';

export interface Yay_kuvveti_deplasman_hesaplamaInput {
  yayKatsayisi: number;
  deplasman: number;
  dataConfidence?: number;
}

export const Yay_kuvveti_deplasman_hesaplamaInputSchema = z.object({
  yayKatsayisi: z.number().min(0).default(500),
  deplasman: z.number().min(0).default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yay_kuvveti_deplasman_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yayKatsayisi * input.deplasman; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYay_kuvveti_deplasman_hesaplama(input: Yay_kuvveti_deplasman_hesaplamaInput): Yay_kuvveti_deplasman_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "N",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Yay_kuvveti_deplasman_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yay_kuvveti_deplasman_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: ["sonuc"],
} as const;

