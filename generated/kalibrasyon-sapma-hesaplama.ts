// Auto-generated from kalibrasyon-sapma-hesaplama-schema.json
import * as z from 'zod';

export interface Kalibrasyon_sapma_hesaplamaInput {
  sonHata: number;
  oncekiHata: number;
  gecenSure: number;
  dataConfidence?: number;
}

export const Kalibrasyon_sapma_hesaplamaInputSchema = z.object({
  sonHata: z.number().min(0).default(0.5),
  oncekiHata: z.number().min(0).default(0.2),
  gecenSure: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kalibrasyon_sapma_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sonHata - input.oncekiHata) / Math.max(1, input.gecenSure); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKalibrasyon_sapma_hesaplama(input: Kalibrasyon_sapma_hesaplamaInput): Kalibrasyon_sapma_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "unit/day",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kalibrasyon_sapma_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kalibrasyon_sapma_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "unit/day",
  breakdownKeys: ["sonuc"],
} as const;

