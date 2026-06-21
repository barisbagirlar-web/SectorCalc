// Auto-generated from dropshipping-kar-hesaplama-schema.json
import * as z from 'zod';

export interface Dropshipping_kar_hesaplamaInput {
  satis: number;
  tedarik: number;
  kargo: number;
  reklam: number;
  dataConfidence?: number;
}

export const Dropshipping_kar_hesaplamaInputSchema = z.object({
  satis: z.number().min(0).default(300),
  tedarik: z.number().min(0).default(120),
  kargo: z.number().min(0).default(30),
  reklam: z.number().min(0).default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dropshipping_kar_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.satis - input.tedarik - input.kargo - input.reklam; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDropshipping_kar_hesaplama(input: Dropshipping_kar_hesaplamaInput): Dropshipping_kar_hesaplamaOutput {
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


export interface Dropshipping_kar_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dropshipping_kar_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

