// Auto-generated from taksi-uber-ucret-hesaplama-schema.json
import * as z from 'zod';

export interface Taksi_uber_ucret_hesaplamaInput {
  acilis: number;
  kmFiyati: number;
  dakikaFiyati: number;
  mesafe: number;
  sure: number;
  dataConfidence?: number;
}

export const Taksi_uber_ucret_hesaplamaInputSchema = z.object({
  acilis: z.number().min(0).default(10),
  kmFiyati: z.number().min(0).default(15),
  dakikaFiyati: z.number().min(0).default(3),
  mesafe: z.number().min(0).default(10),
  sure: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Taksi_uber_ucret_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.acilis + (input.mesafe * input.kmFiyati) + (input.sure * input.dakikaFiyati); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTaksi_uber_ucret_hesaplama(input: Taksi_uber_ucret_hesaplamaInput): Taksi_uber_ucret_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Taksi_uber_ucret_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Taksi_uber_ucret_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

