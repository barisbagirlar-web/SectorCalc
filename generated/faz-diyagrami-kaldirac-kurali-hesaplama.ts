// Auto-generated from faz-diyagrami-kaldirac-kurali-hesaplama-schema.json
import * as z from 'zod';

export interface Faz_diyagrami_kaldirac_kurali_hesaplamaInput {
  C0: number;
  Cl: number;
  Cs: number;
  dataConfidence?: number;
}

export const Faz_diyagrami_kaldirac_kurali_hesaplamaInputSchema = z.object({
  C0: z.number().min(0).default(40),
  Cl: z.number().min(0).default(25),
  Cs: z.number().min(0).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Faz_diyagrami_kaldirac_kurali_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.C0 - input.Cl) / Math.max(0.0001, (input.Cs - input.Cl)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFaz_diyagrami_kaldirac_kurali_hesaplama(input: Faz_diyagrami_kaldirac_kurali_hesaplamaInput): Faz_diyagrami_kaldirac_kurali_hesaplamaOutput {
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
    unit: "fraction",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Faz_diyagrami_kaldirac_kurali_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Faz_diyagrami_kaldirac_kurali_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "fraction",
  breakdownKeys: ["sonuc"],
} as const;

