// Auto-generated from ebay-ucret-hesaplama-schema.json
import * as z from 'zod';

export interface Ebay_ucret_hesaplamaInput {
  satis: number;
  kategori: number;
  sabit: number;
  dataConfidence?: number;
}

export const Ebay_ucret_hesaplamaInputSchema = z.object({
  satis: z.number().min(0).default(500),
  kategori: z.number().min(0).default(13.25),
  sabit: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ebay_ucret_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.satis * input.kategori / 100) + input.sabit; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEbay_ucret_hesaplama(input: Ebay_ucret_hesaplamaInput): Ebay_ucret_hesaplamaOutput {
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


export interface Ebay_ucret_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ebay_ucret_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

