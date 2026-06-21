// Auto-generated from ogrenci-kredisi-hesaplama-schema.json
import * as z from 'zod';

export interface Ogrenci_kredisi_hesaplamaInput {
  tutar: number;
  faiz: number;
  vade: number;
  gracePeriod: number;
  dataConfidence?: number;
}

export const Ogrenci_kredisi_hesaplamaInputSchema = z.object({
  tutar: z.number().min(0).default(100000),
  faiz: z.number().min(0).default(12),
  vade: z.number().min(1).default(60),
  gracePeriod: z.number().min(0).default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ogrenci_kredisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faiz === 0 ? input.tutar / Math.max(1, input.vade) : input.tutar * ((input.faiz / 1200) * Math.pow(1 + input.faiz / 1200, input.vade - input.gracePeriod)) / (Math.pow(1 + input.faiz / 1200, input.vade - input.gracePeriod) - 1); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOgrenci_kredisi_hesaplama(input: Ogrenci_kredisi_hesaplamaInput): Ogrenci_kredisi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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


export interface Ogrenci_kredisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ogrenci_kredisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

