// Auto-generated from terminal-hiz-hesaplama-schema.json
import * as z from 'zod';

export interface Terminal_hiz_hesaplamaInput {
  kutle: number;
  yogunluk: number;
  direncKatsayisi: number;
  alan: number;
  dataConfidence?: number;
}

export const Terminal_hiz_hesaplamaInputSchema = z.object({
  kutle: z.number().min(0).default(80),
  yogunluk: z.number().min(0).default(1.225),
  direncKatsayisi: z.number().min(0).default(0.5),
  alan: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Terminal_hiz_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.max(0, (2 * input.kutle * 9.81) / Math.max(0.0001, (input.yogunluk * input.direncKatsayisi * input.alan)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTerminal_hiz_hesaplama(input: Terminal_hiz_hesaplamaInput): Terminal_hiz_hesaplamaOutput {
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


export interface Terminal_hiz_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Terminal_hiz_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m/s",
  breakdownKeys: ["sonuc"],
} as const;

