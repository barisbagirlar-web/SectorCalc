// Auto-generated from kaynak-boyutlandirma-hesaplama-schema.json
import * as z from 'zod';

export interface Kaynak_boyutlandirma_hesaplamaInput {
  yuk: number;
  kaynakBoyu: number;
  kaynakGerilmesi: number;
  dataConfidence?: number;
}

export const Kaynak_boyutlandirma_hesaplamaInputSchema = z.object({
  yuk: z.number().min(0).default(50000),
  kaynakBoyu: z.number().min(0).default(0.1),
  kaynakGerilmesi: z.number().min(0).default(120000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kaynak_boyutlandirma_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yuk / Math.max(0.0001, (input.kaynakBoyu * input.kaynakGerilmesi)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKaynak_boyutlandirma_hesaplama(input: Kaynak_boyutlandirma_hesaplamaInput): Kaynak_boyutlandirma_hesaplamaOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kaynak_boyutlandirma_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kaynak_boyutlandirma_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

