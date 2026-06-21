// Auto-generated from baglama-halati-kopma-yuku-hesaplama-schema.json
import * as z from 'zod';

export interface Baglama_halati_kopma_yuku_hesaplamaInput {
  halatCapi: number;
  malzemeKatsayisi: number;
  guvenlikFaktoru: number;
  dataConfidence?: number;
}

export const Baglama_halati_kopma_yuku_hesaplamaInputSchema = z.object({
  halatCapi: z.number().min(0).default(20),
  malzemeKatsayisi: z.number().min(0).default(800),
  guvenlikFaktoru: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baglama_halati_kopma_yuku_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI * Math.pow(input.halatCapi / 2, 2) * input.malzemeKatsayisi) / 1000; results["kopmaYuku"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kopmaYuku"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["kopmaYuku"])) / Math.max(0.0001, input.guvenlikFaktoru); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBaglama_halati_kopma_yuku_hesaplama(input: Baglama_halati_kopma_yuku_hesaplamaInput): Baglama_halati_kopma_yuku_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "kN",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Baglama_halati_kopma_yuku_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Baglama_halati_kopma_yuku_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kN",
  breakdownKeys: ["sonuc"],
} as const;

