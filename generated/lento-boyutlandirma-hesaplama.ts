// Auto-generated from lento-boyutlandirma-hesaplama-schema.json
import * as z from 'zod';

export interface Lento_boyutlandirma_hesaplamaInput {
  yuk: number;
  aciklik: number;
  genislik: number;
  yukseklik: number;
  dataConfidence?: number;
}

export const Lento_boyutlandirma_hesaplamaInputSchema = z.object({
  yuk: z.number().min(0).default(10000),
  aciklik: z.number().min(0).default(2),
  genislik: z.number().min(0).default(0.2),
  yukseklik: z.number().min(0).default(0.3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lento_boyutlandirma_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.yuk * input.aciklik) / 8; results["moment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["moment"] = Number.NaN; }
  try { const v = ((input.yuk * input.aciklik) / 8 * (input.yukseklik / 2)) / Math.max(0.0001, (input.genislik * Math.pow(input.yukseklik, 3) / 12)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLento_boyutlandirma_hesaplama(input: Lento_boyutlandirma_hesaplamaInput): Lento_boyutlandirma_hesaplamaOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Lento_boyutlandirma_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lento_boyutlandirma_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

