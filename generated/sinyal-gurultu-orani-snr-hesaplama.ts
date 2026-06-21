// Auto-generated from sinyal-gurultu-orani-snr-hesaplama-schema.json
import * as z from 'zod';

export interface Sinyal_gurultu_orani_snr_hesaplamaInput {
  sinyalGuc: number;
  gurultuGuc: number;
  dataConfidence?: number;
}

export const Sinyal_gurultu_orani_snr_hesaplamaInputSchema = z.object({
  sinyalGuc: z.number().min(0).default(0.001),
  gurultuGuc: z.number().min(0).default(0.000001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sinyal_gurultu_orani_snr_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * Math.log10(Math.max(0.0001, input.sinyalGuc / Math.max(0.0001, input.gurultuGuc))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSinyal_gurultu_orani_snr_hesaplama(input: Sinyal_gurultu_orani_snr_hesaplamaInput): Sinyal_gurultu_orani_snr_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "dB",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sinyal_gurultu_orani_snr_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sinyal_gurultu_orani_snr_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: ["sonuc"],
} as const;

