// Auto-generated from kuyu-taban-basinci-hesaplama-schema.json
import * as z from 'zod';

export interface Kuyu_taban_basinci_hesaplamaInput {
  camurYogunlugu: number;
  derinlik: number;
  dataConfidence?: number;
}

export const Kuyu_taban_basinci_hesaplamaInputSchema = z.object({
  camurYogunlugu: z.number().min(0).default(1500),
  derinlik: z.number().min(0).default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kuyu_taban_basinci_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.camurYogunlugu * 9.81 * input.derinlik) / 1000000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKuyu_taban_basinci_hesaplama(input: Kuyu_taban_basinci_hesaplamaInput): Kuyu_taban_basinci_hesaplamaOutput {
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
    unit: "MPa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kuyu_taban_basinci_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kuyu_taban_basinci_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "MPa",
  breakdownKeys: ["sonuc"],
} as const;

