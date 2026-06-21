// Auto-generated from pil-kapasitesi-yedekleme-hesaplama-schema.json
import * as z from 'zod';

export interface Pil_kapasitesi_yedekleme_hesaplamaInput {
  akuKapasite: number;
  yukGucu: number;
  dcVoltaj: number;
  desarjDerinligi: number;
  dataConfidence?: number;
}

export const Pil_kapasitesi_yedekleme_hesaplamaInputSchema = z.object({
  akuKapasite: z.number().min(0).default(100),
  yukGucu: z.number().min(0).default(500),
  dcVoltaj: z.number().min(0).default(12),
  desarjDerinligi: z.number().min(0).default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pil_kapasitesi_yedekleme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.akuKapasite * input.dcVoltaj * (input.desarjDerinligi / 100)) / Math.max(0.0001, input.yukGucu); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePil_kapasitesi_yedekleme_hesaplama(input: Pil_kapasitesi_yedekleme_hesaplamaInput): Pil_kapasitesi_yedekleme_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "hours",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Pil_kapasitesi_yedekleme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pil_kapasitesi_yedekleme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "hours",
  breakdownKeys: ["sonuc"],
} as const;

