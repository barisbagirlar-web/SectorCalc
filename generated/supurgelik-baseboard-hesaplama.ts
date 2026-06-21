// Auto-generated from supurgelik-baseboard-hesaplama-schema.json
import * as z from 'zod';

export interface Supurgelik_baseboard_hesaplamaInput {
  odaCevresi: number;
  kapiGenisligi: number;
  kapiSayisi: number;
  dataConfidence?: number;
}

export const Supurgelik_baseboard_hesaplamaInputSchema = z.object({
  odaCevresi: z.number().min(0).default(40),
  kapiGenisligi: z.number().min(0).default(0.9),
  kapiSayisi: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Supurgelik_baseboard_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.odaCevresi - (input.kapiGenisligi * input.kapiSayisi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSupurgelik_baseboard_hesaplama(input: Supurgelik_baseboard_hesaplamaInput): Supurgelik_baseboard_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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


export interface Supurgelik_baseboard_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Supurgelik_baseboard_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

