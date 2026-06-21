// Auto-generated from stokes-yasasi-hesaplama-schema.json
import * as z from 'zod';

export interface Stokes_yasasi_hesaplamaInput {
  yariCap: number;
  parcacikYogunluk: number;
  akiskanYogunluk: number;
  viskozite: number;
  dataConfidence?: number;
}

export const Stokes_yasasi_hesaplamaInputSchema = z.object({
  yariCap: z.number().min(0).default(0.001),
  parcacikYogunluk: z.number().min(0).default(2500),
  akiskanYogunluk: z.number().min(0).default(1000),
  viskozite: z.number().min(0).default(0.001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stokes_yasasi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * Math.pow(input.yariCap, 2) * (input.parcacikYogunluk - input.akiskanYogunluk) * 9.81) / Math.max(0.0001, (9 * input.viskozite)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateStokes_yasasi_hesaplama(input: Stokes_yasasi_hesaplamaInput): Stokes_yasasi_hesaplamaOutput {
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
    unit: "m/s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Stokes_yasasi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Stokes_yasasi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m/s",
  breakdownKeys: ["sonuc"],
} as const;

