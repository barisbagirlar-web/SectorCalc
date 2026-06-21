// Auto-generated from kargo-navlu-maliyeti-hesaplama-schema.json
import * as z from 'zod';

export interface Kargo_navlu_maliyeti_hesaplamaInput {
  agirlik: number;
  hacim: number;
  mesafe: number;
  birimFiyat: number;
  dataConfidence?: number;
}

export const Kargo_navlu_maliyeti_hesaplamaInputSchema = z.object({
  agirlik: z.number().min(0).default(50),
  hacim: z.number().min(0).default(0.5),
  mesafe: z.number().min(0).default(1000),
  birimFiyat: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kargo_navlu_maliyeti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hacim * 167; results["desi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["desi"] = Number.NaN; }
  try { const v = Math.max(input.agirlik, (input.hacim * 167)) * input.mesafe * input.birimFiyat; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKargo_navlu_maliyeti_hesaplama(input: Kargo_navlu_maliyeti_hesaplamaInput): Kargo_navlu_maliyeti_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Factor in return rates and chargebacks.","Review platform fee schedules regularly."];
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


export interface Kargo_navlu_maliyeti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kargo_navlu_maliyeti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

