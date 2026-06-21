// Auto-generated from demirleme-zinciri-boyu-hesaplama-schema.json
import * as z from 'zod';

export interface Demirleme_zinciri_boyu_hesaplamaInput {
  suDerinligi: number;
  ruzgarHizi: number;
  dipKatsayisi: number;
  dataConfidence?: number;
}

export const Demirleme_zinciri_boyu_hesaplamaInputSchema = z.object({
  suDerinligi: z.number().min(0).default(15),
  ruzgarHizi: z.number().min(0).default(15),
  dipKatsayisi: z.number().min(0).default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Demirleme_zinciri_boyu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.suDerinligi * (3 + (input.ruzgarHizi / 10))) * input.dipKatsayisi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDemirleme_zinciri_boyu_hesaplama(input: Demirleme_zinciri_boyu_hesaplamaInput): Demirleme_zinciri_boyu_hesaplamaOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Demirleme_zinciri_boyu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Demirleme_zinciri_boyu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

