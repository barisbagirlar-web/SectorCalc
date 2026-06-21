// Auto-generated from kayma-kuvveti-diyagrami-hesaplama-schema.json
import * as z from 'zod';

export interface Kayma_kuvveti_diyagrami_hesaplamaInput {
  yuk: number;
  mesafe: number;
  uzunluk: number;
  dataConfidence?: number;
}

export const Kayma_kuvveti_diyagrami_hesaplamaInputSchema = z.object({
  yuk: z.number().min(0).default(10000),
  mesafe: z.number().min(0).default(1.5),
  uzunluk: z.number().min(0).default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kayma_kuvveti_diyagrami_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mesafe < input.uzunluk / 2 ? input.yuk / 2 : -input.yuk / 2; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKayma_kuvveti_diyagrami_hesaplama(input: Kayma_kuvveti_diyagrami_hesaplamaInput): Kayma_kuvveti_diyagrami_hesaplamaOutput {
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


export interface Kayma_kuvveti_diyagrami_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kayma_kuvveti_diyagrami_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: ["sonuc"],
} as const;

