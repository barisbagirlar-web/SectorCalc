// Auto-generated from kdv-ab-ioss-hesaplama-schema.json
import * as z from 'zod';

export interface Kdv_ab_ioss_hesaplamaInput {
  netFiyat: number;
  kargo: number;
  ulkeKDV: number;
  dataConfidence?: number;
}

export const Kdv_ab_ioss_hesaplamaInputSchema = z.object({
  netFiyat: z.number().min(0).default(100),
  kargo: z.number().min(0).default(15),
  ulkeKDV: z.number().min(0).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kdv_ab_ioss_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.netFiyat + input.kargo) * (input.ulkeKDV / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKdv_ab_ioss_hesaplama(input: Kdv_ab_ioss_hesaplamaInput): Kdv_ab_ioss_hesaplamaOutput {
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
    unit: "EUR",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kdv_ab_ioss_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kdv_ab_ioss_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "EUR",
  breakdownKeys: ["sonuc"],
} as const;

