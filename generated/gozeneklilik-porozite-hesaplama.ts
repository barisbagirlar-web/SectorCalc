// Auto-generated from gozeneklilik-porozite-hesaplama-schema.json
import * as z from 'zod';

export interface Gozeneklilik_porozite_hesaplamaInput {
  boslukHacim: number;
  toplamHacim: number;
  dataConfidence?: number;
}

export const Gozeneklilik_porozite_hesaplamaInputSchema = z.object({
  boslukHacim: z.number().min(0).default(0.2),
  toplamHacim: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gozeneklilik_porozite_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.boslukHacim / Math.max(0.0001, input.toplamHacim)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGozeneklilik_porozite_hesaplama(input: Gozeneklilik_porozite_hesaplamaInput): Gozeneklilik_porozite_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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


export interface Gozeneklilik_porozite_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gozeneklilik_porozite_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

