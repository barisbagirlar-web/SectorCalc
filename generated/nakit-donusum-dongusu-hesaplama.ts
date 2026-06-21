// Auto-generated from nakit-donusum-dongusu-hesaplama-schema.json
import * as z from 'zod';

export interface Nakit_donusum_dongusu_hesaplamaInput {
  stokGun: number;
  alacakGun: number;
  borcGun: number;
  dataConfidence?: number;
}

export const Nakit_donusum_dongusu_hesaplamaInputSchema = z.object({
  stokGun: z.number().min(0).default(60),
  alacakGun: z.number().min(0).default(45),
  borcGun: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nakit_donusum_dongusu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stokGun + input.alacakGun - input.borcGun; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNakit_donusum_dongusu_hesaplama(input: Nakit_donusum_dongusu_hesaplamaInput): Nakit_donusum_dongusu_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "days",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Nakit_donusum_dongusu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Nakit_donusum_dongusu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "days",
  breakdownKeys: ["sonuc"],
} as const;

