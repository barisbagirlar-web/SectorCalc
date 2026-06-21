// Auto-generated from tarife-ek-vergi-hesaplama-schema.json
import * as z from 'zod';

export interface Tarife_ek_vergi_hesaplamaInput {
  urunBedeli: number;
  ekVergi: number;
  dataConfidence?: number;
}

export const Tarife_ek_vergi_hesaplamaInputSchema = z.object({
  urunBedeli: z.number().min(0).default(50000),
  ekVergi: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tarife_ek_vergi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.urunBedeli * (input.ekVergi / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTarife_ek_vergi_hesaplama(input: Tarife_ek_vergi_hesaplamaInput): Tarife_ek_vergi_hesaplamaOutput {
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


export interface Tarife_ek_vergi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tarife_ek_vergi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

