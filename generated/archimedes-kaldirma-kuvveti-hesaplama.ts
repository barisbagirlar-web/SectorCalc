// Auto-generated from archimedes-kaldirma-kuvveti-hesaplama-schema.json
import * as z from 'zod';

export interface Archimedes_kaldirma_kuvveti_hesaplamaInput {
  yogunluk: number;
  hacim: number;
  dataConfidence?: number;
}

export const Archimedes_kaldirma_kuvveti_hesaplamaInputSchema = z.object({
  yogunluk: z.number().min(0).default(1000),
  hacim: z.number().min(0).default(0.01),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Archimedes_kaldirma_kuvveti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yogunluk * 9.81 * input.hacim; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateArchimedes_kaldirma_kuvveti_hesaplama(input: Archimedes_kaldirma_kuvveti_hesaplamaInput): Archimedes_kaldirma_kuvveti_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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


export interface Archimedes_kaldirma_kuvveti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Archimedes_kaldirma_kuvveti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: ["sonuc"],
} as const;

