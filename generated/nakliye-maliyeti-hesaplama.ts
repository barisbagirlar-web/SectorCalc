// Auto-generated from nakliye-maliyeti-hesaplama-schema.json
import * as z from 'zod';

export interface Nakliye_maliyeti_hesaplamaInput {
  mesafe: number;
  tonaj: number;
  birimFiyat: number;
  dataConfidence?: number;
}

export const Nakliye_maliyeti_hesaplamaInputSchema = z.object({
  mesafe: z.number().min(0).default(500),
  tonaj: z.number().min(0).default(20),
  birimFiyat: z.number().min(0).default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nakliye_maliyeti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mesafe * input.tonaj * input.birimFiyat; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNakliye_maliyeti_hesaplama(input: Nakliye_maliyeti_hesaplamaInput): Nakliye_maliyeti_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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


export interface Nakliye_maliyeti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Nakliye_maliyeti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

