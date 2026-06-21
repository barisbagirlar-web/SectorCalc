// Auto-generated from amazon-fba-kar-hesaplama-schema.json
import * as z from 'zod';

export interface Amazon_fba_kar_hesaplamaInput {
  satis: number;
  urunMaliyeti: number;
  fbaUcreti: number;
  komisyon: number;
  dataConfidence?: number;
}

export const Amazon_fba_kar_hesaplamaInputSchema = z.object({
  satis: z.number().min(0).default(200),
  urunMaliyeti: z.number().min(0).default(80),
  fbaUcreti: z.number().min(0).default(30),
  komisyon: z.number().min(0).max(100).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Amazon_fba_kar_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.satis - input.urunMaliyeti - input.fbaUcreti - (input.satis * input.komisyon / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAmazon_fba_kar_hesaplama(input: Amazon_fba_kar_hesaplamaInput): Amazon_fba_kar_hesaplamaOutput {
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


export interface Amazon_fba_kar_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Amazon_fba_kar_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

