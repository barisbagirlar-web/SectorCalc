// Auto-generated from fayans-dizilimi-hesaplama-schema.json
import * as z from 'zod';

export interface Fayans_dizilimi_hesaplamaInput {
  alanEn: number;
  fayansEn: number;
  dataConfidence?: number;
}

export const Fayans_dizilimi_hesaplamaInputSchema = z.object({
  alanEn: z.number().min(0).default(4.2),
  fayansEn: z.number().min(0).default(0.6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fayans_dizilimi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.alanEn % input.fayansEn) / Math.max(0.0001, input.fayansEn) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFayans_dizilimi_hesaplama(input: Fayans_dizilimi_hesaplamaInput): Fayans_dizilimi_hesaplamaOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fayans_dizilimi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fayans_dizilimi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

