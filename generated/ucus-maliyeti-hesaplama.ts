// Auto-generated from ucus-maliyeti-hesaplama-schema.json
import * as z from 'zod';

export interface Ucus_maliyeti_hesaplamaInput {
  mesafe: number;
  yolcuSayisi: number;
  koltukMaliyeti: number;
  dataConfidence?: number;
}

export const Ucus_maliyeti_hesaplamaInputSchema = z.object({
  mesafe: z.number().min(0).default(3000),
  yolcuSayisi: z.number().min(1).default(180),
  koltukMaliyeti: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ucus_maliyeti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mesafe * input.koltukMaliyeti; results["toplam"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplam"] = Number.NaN; }
  try { const v = (input.mesafe * input.koltukMaliyeti) / Math.max(1, input.yolcuSayisi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateUcus_maliyeti_hesaplama(input: Ucus_maliyeti_hesaplamaInput): Ucus_maliyeti_hesaplamaOutput {
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


export interface Ucus_maliyeti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ucus_maliyeti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

