// Auto-generated from hacimsel-agirlik-desi-hesaplama-schema.json
import * as z from 'zod';

export interface Hacimsel_agirlik_desi_hesaplamaInput {
  en: number;
  boy: number;
  yukseklik: number;
  bolen: number;
  dataConfidence?: number;
}

export const Hacimsel_agirlik_desi_hesaplamaInputSchema = z.object({
  en: z.number().min(0).default(30),
  boy: z.number().min(0).default(40),
  yukseklik: z.number().min(0).default(30),
  bolen: z.number().min(1).default(3000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hacimsel_agirlik_desi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.en * input.boy * input.yukseklik) / Math.max(1, input.bolen); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHacimsel_agirlik_desi_hesaplama(input: Hacimsel_agirlik_desi_hesaplamaInput): Hacimsel_agirlik_desi_hesaplamaOutput {
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Hacimsel_agirlik_desi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hacimsel_agirlik_desi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg",
  breakdownKeys: ["sonuc"],
} as const;

