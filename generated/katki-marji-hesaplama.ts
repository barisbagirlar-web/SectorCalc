// Auto-generated from katki-marji-hesaplama-schema.json
import * as z from 'zod';

export interface Katki_marji_hesaplamaInput {
  satisFiyati: number;
  degiskenMaliyet: number;
  dataConfidence?: number;
}

export const Katki_marji_hesaplamaInputSchema = z.object({
  satisFiyati: z.number().min(0).default(100),
  degiskenMaliyet: z.number().min(0).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Katki_marji_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.satisFiyati - input.degiskenMaliyet; results["katki"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["katki"] = Number.NaN; }
  try { const v = ((input.satisFiyati - input.degiskenMaliyet) / Math.max(0.0001, input.satisFiyati)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKatki_marji_hesaplama(input: Katki_marji_hesaplamaInput): Katki_marji_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Katki_marji_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Katki_marji_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

