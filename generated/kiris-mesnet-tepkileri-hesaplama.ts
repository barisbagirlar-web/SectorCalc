// Auto-generated from kiris-mesnet-tepkileri-hesaplama-schema.json
import * as z from 'zod';

export interface Kiris_mesnet_tepkileri_hesaplamaInput {
  yuk: number;
  uzunluk: number;
  yukKonum: number;
  dataConfidence?: number;
}

export const Kiris_mesnet_tepkileri_hesaplamaInputSchema = z.object({
  yuk: z.number().min(0).default(10000),
  uzunluk: z.number().min(0).default(6),
  yukKonum: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kiris_mesnet_tepkileri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yuk * Math.max(0, (input.uzunluk - input.yukKonum)) / Math.max(0.0001, input.uzunluk); results["RA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RA"] = Number.NaN; }
  try { const v = input.yuk - input.yuk * Math.max(0, (input.uzunluk - input.yukKonum)) / Math.max(0.0001, input.uzunluk); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKiris_mesnet_tepkileri_hesaplama(input: Kiris_mesnet_tepkileri_hesaplamaInput): Kiris_mesnet_tepkileri_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    RA: toNumericFormulaValue(values["RA"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Quantum effects are only observable at microscopic scales.","These are idealized models."];
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
    unit: "N",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kiris_mesnet_tepkileri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { RA: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kiris_mesnet_tepkileri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: ["RA","sonuc"],
} as const;

