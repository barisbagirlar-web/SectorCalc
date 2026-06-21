// Auto-generated from boru-termal-gerilme-hesaplama-schema.json
import * as z from 'zod';

export interface Boru_termal_gerilme_hesaplamaInput {
  elastisiteModulu: number;
  genlesmeKatsayisi: number;
  sicaklikFarki: number;
  dataConfidence?: number;
}

export const Boru_termal_gerilme_hesaplamaInputSchema = z.object({
  elastisiteModulu: z.number().min(0).default(200000000000),
  genlesmeKatsayisi: z.number().min(0).default(0.000012),
  sicaklikFarki: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Boru_termal_gerilme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.elastisiteModulu * input.genlesmeKatsayisi * input.sicaklikFarki; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBoru_termal_gerilme_hesaplama(input: Boru_termal_gerilme_hesaplamaInput): Boru_termal_gerilme_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Boru_termal_gerilme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Boru_termal_gerilme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

