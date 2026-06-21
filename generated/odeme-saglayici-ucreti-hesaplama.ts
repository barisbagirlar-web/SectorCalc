// Auto-generated from odeme-saglayici-ucreti-hesaplama-schema.json
import * as z from 'zod';

export interface Odeme_saglayici_ucreti_hesaplamaInput {
  satis: number;
  yuzde: number;
  sabit: number;
  dataConfidence?: number;
}

export const Odeme_saglayici_ucreti_hesaplamaInputSchema = z.object({
  satis: z.number().min(0).default(1000),
  yuzde: z.number().min(0).default(2.9),
  sabit: z.number().min(0).default(2.35),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Odeme_saglayici_ucreti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.satis * input.yuzde / 100) + input.sabit; results["kesinti"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kesinti"] = Number.NaN; }
  try { const v = input.satis - ((input.satis * input.yuzde / 100) + input.sabit); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOdeme_saglayici_ucreti_hesaplama(input: Odeme_saglayici_ucreti_hesaplamaInput): Odeme_saglayici_ucreti_hesaplamaOutput {
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


export interface Odeme_saglayici_ucreti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Odeme_saglayici_ucreti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

