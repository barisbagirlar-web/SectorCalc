// Auto-generated from ince-cidarli-kap-gerilme-hesaplama-schema.json
import * as z from 'zod';

export interface Ince_cidarli_kap_gerilme_hesaplamaInput {
  basinc: number;
  cap: number;
  kalinlik: number;
  dataConfidence?: number;
}

export const Ince_cidarli_kap_gerilme_hesaplamaInputSchema = z.object({
  basinc: z.number().min(0).default(500000),
  cap: z.number().min(0).default(0.3),
  kalinlik: z.number().min(0).default(0.003),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ince_cidarli_kap_gerilme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.basinc * input.cap) / Math.max(0.0001, (2 * input.kalinlik)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateInce_cidarli_kap_gerilme_hesaplama(input: Ince_cidarli_kap_gerilme_hesaplamaInput): Ince_cidarli_kap_gerilme_hesaplamaOutput {
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


export interface Ince_cidarli_kap_gerilme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ince_cidarli_kap_gerilme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

