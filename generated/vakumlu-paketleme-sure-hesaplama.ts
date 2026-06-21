// Auto-generated from vakumlu-paketleme-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Vakumlu_paketleme_sure_hesaplamaInput {
  posetHacim: number;
  pompaDebi: number;
  baslangicBasinc: number;
  hedefBasinc: number;
  dataConfidence?: number;
}

export const Vakumlu_paketleme_sure_hesaplamaInputSchema = z.object({
  posetHacim: z.number().min(0).default(0.01),
  pompaDebi: z.number().min(0).default(0.0005),
  baslangicBasinc: z.number().min(0).default(101325),
  hedefBasinc: z.number().min(0).default(5000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vakumlu_paketleme_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.posetHacim / Math.max(0.0001, input.pompaDebi)) * Math.log(Math.max(0.0001, input.baslangicBasinc / Math.max(0.0001, input.hedefBasinc))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateVakumlu_paketleme_sure_hesaplama(input: Vakumlu_paketleme_sure_hesaplamaInput): Vakumlu_paketleme_sure_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Vakumlu_paketleme_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vakumlu_paketleme_sure_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["sonuc"],
} as const;

